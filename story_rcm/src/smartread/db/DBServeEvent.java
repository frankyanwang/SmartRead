package smartread.db;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import smartread.ServeEvent;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;

public class DBServeEvent extends DBBase{
    private static final Logger logger = LogManager.getLogger(DBUser.class);

    public static Map<String, List<ServeEvent>> QueryEvents(int min) {
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

        Long current = System.currentTimeMillis();
        Long time = current - min * 60 * 1000;

        DBCollection coll = db.getCollection(DB_SERVE_EVENT_TABLE);
        BasicDBObject query = new BasicDBObject("timestamp", new BasicDBObject(
                "$gt", time));
        DBCursor cursor = coll.find(query);

        Map<String, List<ServeEvent>> serves = new HashMap<String, List<ServeEvent>>();
        try {
            while (cursor.hasNext()) {
                DBObject obj = cursor.next();
                if(!serves.containsKey(obj.get(DB_UID_FIELD))){
                    serves.put((String) obj.get(DB_UID_FIELD), new ArrayList<ServeEvent>());
                }
                
                serves.get(obj.get(DB_UID_FIELD)).add(new ServeEvent((String) obj.get("story_id"),
                        (String) obj.get(DB_UID_FIELD), (String) obj.get(DB_TAG_FIELD),
                        (Integer) obj.get("timespend")));
            }
        } finally {
            cursor.close();
        }
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to query serve events for the last "+min+" minutes: "+ String.valueOf(endtime-starttime));
        return serves;
    }
}
