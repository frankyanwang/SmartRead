package smartread.db;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.UnknownHostException;
import java.util.Properties;

import com.mongodb.DB;
import com.mongodb.MongoClient;

public abstract class DBBase {
    static MongoClient mongoClient = null;
    static DB db = null;
    static Properties prop = new Properties();
    static {
        try {
            prop.load(new FileInputStream("conf/db.conf"));
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
    static final String DB_HOST = prop.getProperty("host");
    static final int DB_PORT = Integer.parseInt(prop.getProperty("port"));
    
    static final String DB_NAME = prop.getProperty("db");;
    static final String DB_USERNAME = prop.getProperty("username");;
    static final char[] DB_PASSWORD = prop.getProperty("password").toCharArray();
    
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
        mongoClient = new MongoClient(DB_HOST, DB_PORT);
        db = mongoClient.getDB(DB_NAME);
        if(!db.isAuthenticated()){
            db.authenticate(DB_USERNAME, DB_PASSWORD);
        }
    }
}
