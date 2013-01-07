package smartread.db;

import java.net.UnknownHostException;

import com.mongodb.DB;
import com.mongodb.MongoClient;

public abstract class DBBase {
    static MongoClient mongoClient = null;
    static DB db = null;
    static String DBName = "test";
    
    static void initDB() throws UnknownHostException{
        mongoClient = new MongoClient();
        db = mongoClient.getDB(DBName);
    }
}
