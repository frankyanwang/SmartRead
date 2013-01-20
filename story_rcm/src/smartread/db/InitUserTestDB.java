package smartread.db;

import java.net.UnknownHostException;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

public class InitUserTestDB {
    public static void main(String args[]) throws UnknownHostException {
        MongoClient mongoClient = new MongoClient();
        DB db = mongoClient.getDB(DBBase.DB_NAME);
        DBCollection coll = db.getCollection(DBBase.DB_USER_INTEREST_TABLE);
        coll.drop();
        BasicDBObject doc = new BasicDBObject("user", "test_user1")
                .append("interests_5m",
                        new BasicDBObject("tech", 2).append("news", 3))
                .append("interests_1h", new BasicDBObject())
                .append("interests_1d", new BasicDBObject("tech", 1))
                .append("interests_7d", new BasicDBObject("tech", 1));
        coll.insert(doc);

        doc = new BasicDBObject("user", "test_user2")
                .append("interests_5m",
                        new BasicDBObject("spt", 3).append("fas", 2))
                .append("interests_1h", new BasicDBObject())
                .append("interests_1d", new BasicDBObject())
                .append("interests_7d", new BasicDBObject("tech", 1));
        coll.insert(doc);

        doc = new BasicDBObject("user", "test_user3")
                .append("interests_5m",
                        new BasicDBObject("spt", 3).append("tech", 2))
                .append("interests_1h", new BasicDBObject())
                .append("interests_1d", new BasicDBObject())
                .append("interests_7d", new BasicDBObject());
        coll.insert(doc);

    }
}
