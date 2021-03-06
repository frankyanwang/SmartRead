package smartread.db;

import java.net.UnknownHostException;
import java.util.Collections;
import java.util.List;

import smartread.Story;
import smartread.StoryComparator;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;

public class DBUserStoryIndex extends DBBase {
    public static void storeUserStory(String uid, List<Story> stories) {
        if (mongoClient == null) {
            try {
                initDB();
            } catch (UnknownHostException e) {
                e.printStackTrace();
            }
        }

        Collections.sort(stories, new StoryComparator());

        BasicDBObject userStories = new BasicDBObject(DB_UID_FIELD, uid);
        BasicDBObject storyIndex = new BasicDBObject();
        BasicDBList storyList = new BasicDBList();

        for (Story s : stories) {
            storyIndex.append(s.getStoryID(), s.getNScore());
            storyList.add(s.getStoryID());
        }
        userStories.append(DB_INDEX_FIELD, storyIndex);
        userStories.append(DB_LIST_FIELD, storyList);

        DBCollection coll = db.getCollection(DB_USER_STORY_TABLE);
        DBObject query = new BasicDBObject(DB_UID_FIELD, uid);
        DBObject user = coll.findOne(query);
        if (user == null) {
            coll.insert(userStories);
        } else {
            coll.update(query, userStories);
        }
    }
}
