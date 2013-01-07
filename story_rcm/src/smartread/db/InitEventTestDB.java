package smartread.db;

import java.net.UnknownHostException;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

public class InitEventTestDB {
    public static void main(String args[]) throws UnknownHostException {
        MongoClient mongoClient = new MongoClient();
        DB db = mongoClient.getDB("test");
        DBCollection coll = db.getCollection("serve_events");
        //coll.drop();
        BasicDBObject doc = new BasicDBObject("story_id", "50d25afcc5ace13555000006")
                .append("uid", "test_user1")
                .append("timespend", 300).append("tags", "tech")
                .append("timestamp", System.currentTimeMillis());
        coll.insert(doc);

        doc = new BasicDBObject("story_id", "50d2952fb791783156000015")
                .append("uid", "test_user2").append("timespend", 200)
                .append("tags", "fas")
                .append("timestamp", System.currentTimeMillis());
        coll.insert(doc);

        doc = new BasicDBObject("story_id", "50d2952fb791783156000015")
                .append("uid", "test_user1").append("timespend", 150)
                .append("tags", "fas")
                .append("timestamp", System.currentTimeMillis());
        coll.insert(doc);
    }
}
