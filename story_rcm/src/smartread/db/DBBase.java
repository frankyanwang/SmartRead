package smartread.db;

import java.net.UnknownHostException;

import com.mongodb.DB;
import com.mongodb.MongoClient;

public abstract class DBBase {
    static MongoClient mongoClient = null;
    static DB db = null;
    static String DBName = "test";
    
    static String DB_USER_TABLE = "users";
    static String DB_STORY_TABLE = "stories";
    static String DB_SERVE_EVENT_TABLE = "serve_events";
    static String DB_USER_STORY_TABLE = "user_stories";

    static String DB_UID_FIELD = "uid";
    static String DB_OID_FIELD = "_id";
    static String DB_SCORE_FIELD = "score";
    static String DB_CATEGORY_FIELD = "category";
    static String DB_TAG_FIELD = "tags";
    
    
    static void initDB() throws UnknownHostException{
        mongoClient = new MongoClient();
        db = mongoClient.getDB(DBName);
    }
}
