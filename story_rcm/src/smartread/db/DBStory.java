package smartread.db;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.types.ObjectId;

import smartread.Story;
import smartread.tag.ExtractTags;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class DBStory extends DBBase {
    private static final Logger logger = LogManager.getLogger(DBStory.class);

    private static int LOOKBACK_DAYS = 7;

    private static int TOP_STORY_SIZE = 3500;

    private static double checkSimilar(BasicDBList fTags, BasicDBList sTags) {
        double f_similarity = 0;
        int f_count = 0;

        if (fTags.size() < 2 || sTags.size() < 2) {
            return 0;
        }

        for (Object s : fTags) {
            if (sTags.contains(s)) {
                f_count++;
            }
        }
        f_similarity = 1.0 * f_count / fTags.size();

        double s_similarity = 0;
        int s_count = 0;
        for (Object s : sTags) {
            if (fTags.contains(s)) {
                s_count++;
            }
        }
        s_similarity = 1.0 * s_count / sTags.size();

        return f_similarity > s_similarity ? f_similarity : s_similarity;
    }

    public static void cleanUpTopStory() {
        Long starttime = System.currentTimeMillis();
        if (mongoClient == null) {
            try {
                initDB();
            } catch (UnknownHostException e) {
                e.printStackTrace();
            }
        }

        DBCollection topStoryColl = db.getCollection(DB_TOP_STORY_TABLE);
        logger.debug("Total top stories before clean up: "
                + topStoryColl.count());

        // remove stories are older than 7 days
        Date date = new Date(System.currentTimeMillis() - 1000 * 60 * 60 * 24
                * LOOKBACK_DAYS);
        DBObject query = new BasicDBObject(DB_DATE_FIELD, new BasicDBObject(
                "$lt", date));
        topStoryColl.remove(query);
        logger.debug("Total top stories after clean up 7 days old: "
                + topStoryColl.count());

        // remove stories over the TOP_STORY_SIZE
        DBCursor cursor = topStoryColl.find()
                .sort(new BasicDBObject(DB_SCORE_FIELD, -1).append(
                        DB_DATE_FIELD, -1));
        try {
            if (cursor.size() > TOP_STORY_SIZE) {
                cursor = cursor.skip(TOP_STORY_SIZE);
                DBObject obj = cursor.next();
                date = (Date) obj.get(DB_DATE_FIELD);
                Double score = (Double) obj.get(DB_SCORE_FIELD);
                query = new BasicDBObject(DB_SCORE_FIELD, new BasicDBObject(
                        "$lt", score));
                logger.debug("topStoryColl remove query: " + query);
                topStoryColl.remove(query);
            }
        } finally {
            cursor.close();
        }
        logger.debug("Total top stories after clean up maximum "
                + TOP_STORY_SIZE + " stories: " + topStoryColl.count());

        // remove duplicate
        List<DBObject> stories = topStoryColl.find()
                .sort(new BasicDBObject(DB_DATE_FIELD, 1)).toArray();
        for (int i = 0; i < stories.size(); i++) {
            DBObject fStory = stories.get(i);
            BasicDBList f_tags = (BasicDBList) fStory.get(DB_TAG_FIELD);
            for (int j = i + 1; j < stories.size(); j++) {
                DBObject sStory = stories.get(j);

                BasicDBList s_tags = (BasicDBList) sStory.get(DB_TAG_FIELD);
                if (checkSimilar(f_tags, s_tags) > 0.5) {
                    int x = ((Double) fStory.get(DB_SCORE_FIELD) >= (Double) sStory
                            .get(DB_SCORE_FIELD)) ? j : i;
                    topStoryColl.remove(stories.remove(x));
                    j--;
                    logger.debug("These two stories are simiar:\n1: "
                            + fStory.get("name") + "\n2: " + sStory.get("name"));
                    // logger.debug("Base story from top_stories: "+fStory.toString());
                    // logger.debug("Remove a similar story from top_stories: "+sStory.toString());
                }
            }
        }
        logger.debug("Total top stories after clean up duplicates: "
                + topStoryColl.count());
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to clean up top stories in DB: "
                + String.valueOf(endtime - starttime));
    }

    public static Story getStory(String storyID) {
        Long starttime = System.currentTimeMillis();

        if (mongoClient == null) {
            try {
                initDB();
            } catch (UnknownHostException e) {
                e.printStackTrace();
                return null;
            }
        }

        DBCollection coll = db.getCollection(DB_TOP_STORY_TABLE);

        DBObject q = new BasicDBObject(DB_OID_FIELD, new ObjectId(storyID));

        DBObject story = coll.findOne(q);

        Double score = (Double) story.get(DB_SCORE_FIELD);
        Date date = (Date) story.get(DB_DATE_FIELD);
        List<String> tags = new ArrayList<String>();
        BasicDBList tagList = (BasicDBList) story.get(DB_CATEGORY_FIELD);
        for (Object o : tagList) {
            tags.add(o.toString());
        }

        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to retrive story " + storyID
                + " from DB: " + String.valueOf(endtime - starttime));

        return new Story(storyID, score, tags, date);
    }

    public static void main(String args[]) {
        DBStory.updateTopStory();
        DBStory.cleanUpTopStory();
    }

    public static List<Story> retrieveDefaultStory() {
        Long starttime = System.currentTimeMillis();

        if (mongoClient == null) {
            try {
                initDB();
            } catch (UnknownHostException e) {
                e.printStackTrace();
                return null;
            }
        }

        DBCollection coll = db.getCollection(DB_TOP_STORY_TABLE);

        DBCursor cursor = coll.find();
        List<Story> stories = new ArrayList<Story>();
        try {
            while (cursor.hasNext()) {
                DBObject obj = cursor.next();
                Double score = Double.valueOf(obj.get(DB_SCORE_FIELD)
                        .toString());
                String id = obj.get(DB_OID_FIELD).toString();
                Date date = (Date) obj.get(DB_DATE_FIELD);
                List<String> tags = new ArrayList<String>();

                BasicDBList tagList = (BasicDBList) obj.get(DB_CATEGORY_FIELD);
                for (Object o : tagList) {
                    tags.add(o.toString());
                }
                stories.add(new Story(id, score, tags, date));
            }
        } finally {
            cursor.close();
        }
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to retrive default stories from DB: "
                + String.valueOf(endtime - starttime));
        return stories;
    }

    public static void updateTopStory() {
        Long starttime = System.currentTimeMillis();

        if (mongoClient == null) {
            try {
                initDB();
            } catch (UnknownHostException e) {
                e.printStackTrace();
            }
        }
        DBCollection storyColl = db.getCollection(DB_POSTS_TABLE);
        DBCollection topStoryColl = db.getCollection(DB_TOP_STORY_TABLE);
        DBCollection tagsColl = db.getCollection(DB_TAGS_TABLE);

        Date date = new Date(System.currentTimeMillis() - 1000 * 60 * 60 * 24
                * LOOKBACK_DAYS);

        // remove posts 7 days old
        storyColl.remove(new BasicDBObject(DB_DATE_FIELD, new BasicDBObject(
                "$lt", date)));

        BasicDBObject query = new BasicDBObject(DB_DATE_FIELD,
                new BasicDBObject("$gte", date));

        DBCursor cursor = storyColl.find(query)
                .sort(new BasicDBObject(DB_SCORE_FIELD, -1))
                .sort(new BasicDBObject(DB_DATE_FIELD, -1));

        ExtractTags et = new ExtractTags();

        try {
            List<DBObject> list = new ArrayList<DBObject>();
            int size = 0;
            while (cursor.hasNext() && size < TOP_STORY_SIZE) {
                int matchedTag = 0;
                DBObject obj = cursor.next();
                Double score = Double.valueOf(obj.get(DB_SCORE_FIELD)
                        .toString());
                BasicDBList tags = (BasicDBList) obj.get(DB_TAG_FIELD);
                if (tags.size() <= 5) {
                    List<String> newTags = et.getTags((String) obj.get("name"));
                    for (String s : newTags) {
                        if (!tags.contains(s)) {
                            tags.add(s);
                        }
                    }
                }

                for (int i = 0; i < tags.size(); i++) {
                    String tag = (String) tags.get(i);
                    if (tagsColl.findOne(new BasicDBObject("name", tag)) != null) {
                        matchedTag++;
                    }
                }
                if (score == null) {
                    score = DEFAULT_STORY_SCORE;
                }
                obj.put(DB_SCORE_FIELD, (100 + matchedTag) / 100.0 * score);
                list.add(obj);
                size++;
            }

            for (DBObject story : list) {
                DBObject obj = topStoryColl.findAndModify(new BasicDBObject(
                        "_id", story.get("_id")), story);
                if (obj == null) {
                    topStoryColl.insert(story);
                }
            }

            cursor = topStoryColl.find();
            while (cursor.hasNext()) {
                DBObject obj = cursor.next();
                if (!list.contains(obj)) {
                    topStoryColl.remove(obj);
                }
            }

        } finally {
            cursor.close();
        }
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to update top stories in DB: "
                + String.valueOf(endtime - starttime));
    }
}
