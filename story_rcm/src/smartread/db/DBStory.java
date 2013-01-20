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

import smartread.Story;

public class DBStory extends DBBase{
    private static final Logger logger = LogManager.getLogger(DBStory.class);

    public static List<Story> retrieveDefaultStory() {
        Long starttime = System.currentTimeMillis();

        if(mongoClient == null){
            try {
                initDB();
            } catch (UnknownHostException e) {
                // TODO Auto-generated catch block
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
                List<String> tags = new ArrayList<String>();
                
                BasicDBList tagList = (BasicDBList) obj.get(DB_CATEGORY_FIELD);
                for(Object o: tagList){
                    tags.add(o.toString());
                }
                stories.add(new Story(id, score, tags));
            }
        } finally {
            cursor.close();
        }
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to retrive default stories from DB: "+ String.valueOf(endtime-starttime));
        return stories;
    }

    public static void updateTopStory(){
        Long starttime = System.currentTimeMillis();

        if(mongoClient == null){
            try {
                initDB();
            } catch (UnknownHostException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        DBCollection storyColl = db.getCollection(DB_POSTS_TABLE);
        DBCollection topStoryColl = db.getCollection(DB_TOP_STORY_TABLE);
        DBCollection tagsColl = db.getCollection(DB_TAGS_TABLE);
    
        Date date = new Date(System.currentTimeMillis()-1000*60*60*24*7);
        BasicDBObject query  = new BasicDBObject("pubDate", new BasicDBObject("$gte", date));
        DBCursor cursor = storyColl.find(query).sort(new BasicDBObject("pubDate", -1));
        
        try {
            List<DBObject> list = new ArrayList<DBObject>();
            int size = 0;
            while (cursor.hasNext() && size<500) {
                int matchedTag = 0;
                DBObject obj = cursor.next();
                BasicDBList tags = (BasicDBList) obj.get(DB_TAG_FIELD);
                for(int i=0; i<tags.size(); i++){
                    String tag = (String) tags.get(i);
                    if (tagsColl.findOne(new BasicDBObject("name",tag)) != null)
                        matchedTag++;
                }
                obj.put(DB_SCORE_FIELD, DEFAULT_STORY_SCORE*(100+matchedTag)/100);
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
    
    public static Story getStory(String storyID){
        Long starttime = System.currentTimeMillis();

        if(mongoClient == null){
            try {
                initDB();
            } catch (UnknownHostException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                return null;
            }
        }

        DBCollection coll = db.getCollection(DB_TOP_STORY_TABLE);

        DBObject q = new BasicDBObject(DB_OID_FIELD, new ObjectId(storyID));
        
        DBObject story = coll.findOne(q);
        
        Double score = (Double) story.get(DB_SCORE_FIELD);
        List<String> tags = new ArrayList<String>();
        BasicDBList tagList = (BasicDBList) story.get(DB_CATEGORY_FIELD);
        for(Object o: tagList){
            tags.add(o.toString());
        }
        
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to retrive story "+storyID+" from DB: "+ String.valueOf(endtime-starttime));

        return new Story(storyID, score, tags);
    }
    
    public static void main(String args[]) {
        DBStory.updateTopStory();
    }
}
