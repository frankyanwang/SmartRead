package smartread.db;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.types.ObjectId;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.WriteConcern;
import com.mongodb.WriteResult;

import smartread.Story;

public class DBStory extends DBBase{
    private static final Logger logger = LogManager.getLogger(DBStory.class);

    public static List<Story> retrieveDefaultStory() {
        Long starttime = System.currentTimeMillis();

        if(mongoClient == null){
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
                Double score = Double.valueOf(obj.get(DB_SCORE_FIELD).toString());
                String id = obj.get(DB_OID_FIELD).toString();
                Date date = (Date) obj.get("pubDate");
                List<String> tags = new ArrayList<String>();
                
                BasicDBList tagList = (BasicDBList) obj.get(DB_CATEGORY_FIELD);
                for(Object o: tagList){
                    tags.add(o.toString());
                }
                stories.add(new Story(id, score, tags, date));
            }
        } finally {
            cursor.close();
        }
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to retrive default stories from DB: "+ String.valueOf(endtime-starttime));
        return stories;
    }
    private static int TOP_STORY_SIZE = 3500;
    private static int LOOKBACK_DAYS = 7;
    
    public static void updateTopStory(){
        Long starttime = System.currentTimeMillis();

        if(mongoClient == null){
            try {
                initDB();
            } catch (UnknownHostException e) {
                e.printStackTrace();
            }
        }
        DBCollection storyColl = db.getCollection(DB_POSTS_TABLE);
        DBCollection topStoryColl = db.getCollection(DB_TOP_STORY_TABLE);
        DBCollection tagsColl = db.getCollection(DB_TAGS_TABLE);
    
        Date date = new Date(System.currentTimeMillis()-1000*60*60*24*LOOKBACK_DAYS);
        BasicDBObject query  = new BasicDBObject("pubDate", new BasicDBObject("$gte", date));
        DBCursor cursor = storyColl.find(query).sort(new BasicDBObject("score", -1)).sort(new BasicDBObject("pubDate", -1));
        
        try {
            List<DBObject> list = new ArrayList<DBObject>();
            int size = 0;
            while (cursor.hasNext() && size<TOP_STORY_SIZE) {
                int matchedTag = 0;
                DBObject obj = cursor.next();
                Double score = Double.valueOf(obj.get(DB_SCORE_FIELD).toString());
                BasicDBList tags = (BasicDBList) obj.get(DB_TAG_FIELD);
                for(int i=0; i<tags.size(); i++){
                    String tag = (String) tags.get(i);
                    if (tagsColl.findOne(new BasicDBObject("name",tag)) != null)
                        matchedTag++;
                }
                if(score == null){
                    score = DEFAULT_STORY_SCORE;
                }
                obj.put(DB_SCORE_FIELD, score*(100+matchedTag)/100);
                list.add(obj);
                size++;
            }
            topStoryColl.insert(list, WriteConcern.ERRORS_IGNORED);
        } finally {
            cursor.close();
        }
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to update top stories in DB: "+ String.valueOf(endtime-starttime));
    }
    
    public static void cleanUpTopStory(){
        Long starttime = System.currentTimeMillis();

        DBCollection topStoryColl = db.getCollection(DB_TOP_STORY_TABLE);
        Date date = new Date(System.currentTimeMillis()-1000*60*60*24*LOOKBACK_DAYS);
        DBObject query = new BasicDBObject("pubDate", new BasicDBObject("$lt", date));
        WriteResult wr = topStoryColl.remove(query);
        logger.info(wr.toString());
        
        DBCursor cursor = topStoryColl.find().sort(new BasicDBObject("score", -1).append("pubDate", -1));
        if(cursor.size()<=TOP_STORY_SIZE)
            return;
        cursor = cursor.skip(TOP_STORY_SIZE);
        DBObject obj = cursor.next();
        date = (Date) obj.get("pubDate");
        Double score = (Double) obj.get("score");
        query = new BasicDBObject("pubDate", new BasicDBObject("$lt", date)).append("score", new BasicDBObject("$lt", score));
        wr = topStoryColl.remove(query);
        logger.info(wr.toString());
        
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to clean up top stories in DB: "+ String.valueOf(endtime-starttime));
    }
    
    public static Story getStory(String storyID){
        Long starttime = System.currentTimeMillis();

        if(mongoClient == null){
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
        Date date = (Date) story.get("pubDate");
        List<String> tags = new ArrayList<String>();
        BasicDBList tagList = (BasicDBList) story.get(DB_CATEGORY_FIELD);
        for(Object o: tagList){
            tags.add(o.toString());
        }
        
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to retrive story "+storyID+" from DB: "+ String.valueOf(endtime-starttime));

        return new Story(storyID, score, tags, date);
    }
    
    public static void main(String args[]) {
        DBStory.updateTopStory();
        DBStory.cleanUpTopStory();
    }
}
