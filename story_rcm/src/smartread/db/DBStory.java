package smartread.db;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.bson.types.ObjectId;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

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
        
        DBCollection coll = db.getCollection(DB_STORY_TABLE);

        DBCursor cursor = coll.find();
        List<Story> stories = new ArrayList<Story>();
        try {
            while (cursor.hasNext()) {
                DBObject obj = cursor.next();
                Double score = Double.valueOf(obj.get(DB_SCORE_FIELD).toString());
                String id = obj.get(DB_OID_FIELD).toString();
                List<String> tags = new ArrayList<String>();
                tags.add((String) obj.get(DB_CATEGORY_FIELD));
                stories.add(new Story(id, score, tags));
            }
        } finally {
            cursor.close();
        }
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to retrive default stories from DB: "+ String.valueOf(endtime-starttime));
        return stories;
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

        DBCollection coll = db.getCollection(DB_STORY_TABLE);

        DBObject q = new BasicDBObject(DB_OID_FIELD, new ObjectId(storyID));
        
        DBObject story = coll.findOne(q);
        
        Double score = Double.valueOf((String) story.get(DB_SCORE_FIELD));
        List<String> tags = new ArrayList<String>();
        tags.add((String) story.get(DB_CATEGORY_FIELD));
        
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to retrive story "+storyID+" from DB: "+ String.valueOf(endtime-starttime));

        return new Story(storyID, score, tags);
    }
}
