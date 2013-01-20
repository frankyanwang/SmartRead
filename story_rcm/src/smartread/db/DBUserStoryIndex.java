package smartread.db;

import java.net.UnknownHostException;
import java.util.Collections;
import java.util.List;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

import smartread.Story;
import smartread.StoryComparator;

public class DBUserStoryIndex extends DBBase{
    public static void storeUserStory(String uid, List<Story> stories){
        if(mongoClient == null){
            try {
                initDB();
            } catch (UnknownHostException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        Collections.sort(stories, new StoryComparator());
        
        BasicDBObject userStories = new BasicDBObject(DB_UID_FIELD,uid);
        BasicDBObject storyIndex = new BasicDBObject();
        
        for(Story s: stories){
            storyIndex.append(s.getStoryID(), s.getScore());
        }
        userStories.append(DB_INDEX_FIELD, storyIndex);
        
        DBCollection coll = db.getCollection(DB_USER_STORY_TABLE);
        DBObject query = new BasicDBObject(DB_UID_FIELD, uid);
        DBObject user = coll.findOne(query);
        if(user==null){
            coll.insert(userStories);
        }else{
            coll.update(query, userStories);
        }
        
    }
}
