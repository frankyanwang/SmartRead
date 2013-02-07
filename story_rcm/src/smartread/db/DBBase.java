package smartread.db;

import java.net.UnknownHostException;
import java.util.Properties;

import com.mongodb.DB;
import com.mongodb.MongoClient;

public abstract class DBBase {
    static DB db = null;
    static final String DB_CATEGORY_FIELD = "tags";
    static final String DB_DATE_FIELD = "pubDate";

    static final String DB_EVENT_TIME_CREATE_FIELD = "createTimeLong";
    static final String DB_EVENT_TIME_SPEND_FIELD = "timespend";

    static String DB_HOST = "localhost";
    static final String DB_INDEX_FIELD = "index";
    static final String DB_INTEREST_FIELD = "interests_";

    static final String DB_LIST_FIELD = "list";

    static String DB_NAME = "smartreaddb";
    static final String DB_OID_FIELD = "_id";
    static char[] DB_PASSWORD = new char[0];
    static int DB_PORT = 27017;
    static final String DB_POSTS_TABLE = "posts";
    static final String DB_SCORE_FIELD = "score";

    static final String DB_SERVE_EVENT_TABLE = "events";
    static final String DB_TAG_FIELD = "tags";

    static final String DB_TAGS_TABLE = "tags";
    static final String DB_TOP_STORY_TABLE = "top_stories";
    static final String DB_UID_FIELD = "user";
    static final String DB_USER_INTEREST_TABLE = "user_interests";
    static final String DB_USER_STORY_TABLE = "user_stories";
    static String DB_USERNAME = "";
    static final double DEFAULT_STORY_SCORE = 90;
    static MongoClient mongoClient = null;
    static Properties prop = new Properties();

    static void initDB() throws UnknownHostException {
        if (System.getenv("NODE_ENV") != null
                && System.getenv("NODE_ENV").equalsIgnoreCase("production")) {
            DB_HOST = "linus.mongohq.com";
            DB_PORT = 10064;
            DB_NAME = System.getenv("DB");
            DB_USERNAME = System.getenv("DB_USER");
            DB_PASSWORD = System.getenv("DB_PASSWORD").toCharArray();
        }

        mongoClient = new MongoClient(DB_HOST, DB_PORT);
        db = mongoClient.getDB(DB_NAME);
        if (!db.isAuthenticated()) {
            db.authenticate(DB_USERNAME, DB_PASSWORD);
        }
    }
}
