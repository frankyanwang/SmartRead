package smartread.db;

import java.net.UnknownHostException;
import java.util.Properties;

import com.mongodb.DB;
import com.mongodb.MongoClient;

public abstract class DBBase {
    static MongoClient mongoClient = null;
    static DB db = null;
    static Properties prop = new Properties();

    static String DB_HOST = "localhost";
    static int DB_PORT = 27017;
    
    static String DB_NAME = "test";
    static String DB_USERNAME = "";
    static char[] DB_PASSWORD = new char[0];
        
    static final String DB_USER_TABLE = "users";
    static final String DB_STORY_TABLE = "stories";
    static final String DB_SERVE_EVENT_TABLE = "serve_events";
    static final String DB_USER_STORY_TABLE = "user_stories";

    static final String DB_UID_FIELD = "uid";
    static final String DB_OID_FIELD = "_id";
    static final String DB_SCORE_FIELD = "score";
    static final String DB_CATEGORY_FIELD = "category";
    static final String DB_TAG_FIELD = "tags";
    static final String DB_INTEREST_FIELD = "interests_";
    
    static void initDB() throws UnknownHostException{
        if(System.getenv("NODE_ENV").equalsIgnoreCase("production")){
            DB_HOST = "linus.mongohq.com";
            DB_PORT = 10064;
            DB_NAME = System.getenv("DB");
            DB_USERNAME = System.getenv("DB_USER");
            DB_PASSWORD = System.getenv("DB_PASSWORD").toCharArray();
        }

        mongoClient = new MongoClient(DB_HOST, DB_PORT);
        db = mongoClient.getDB(DB_NAME);
        if(!db.isAuthenticated()){
            db.authenticate(DB_USERNAME, DB_PASSWORD);
        }
    }
}
