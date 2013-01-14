package smartread;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import smartread.db.DBServeEvent;
import smartread.db.DBStory;
import smartread.db.DBUser;
import smartread.db.DBUserStoryIndex;

import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.LogManager;

public class PersonalizationAPI {
    private static final Logger logger = LogManager.getLogger(PersonalizationAPI.class);
    
    public List<Story> getUserStory(String uid) {
        Long starttime = System.currentTimeMillis();
        List<Story> stories = DBStory.retrieveDefaultStory();
        User user = DBUser.retrieveUser(uid);
        Long endtime = System.currentTimeMillis();
        
        logger.debug("Time(ms) taken to retrive user story: "+ String.valueOf(endtime-starttime));
        
        return calcualte(user, stories);
    }

    public Set<String> updateUserInterests(int lookbackMinute) {
        Long starttime = System.currentTimeMillis();
        Map<String, List<ServeEvent>> serves = DBServeEvent.QueryEvents(lookbackMinute);
        String freq;
        if(lookbackMinute==5)
            freq = "5m";
        else if(lookbackMinute==60)
            freq = "1h";
        else if(lookbackMinute==60*24)
            freq = "1d";
        else if(lookbackMinute==60*24*7)
            freq = "7d";
        else{
            return null;
        }
        
        for (String uid : serves.keySet()) {
            Map<List<String>, Double> tags = new HashMap<List<String>, Double>();
            
            
            List<ServeEvent> userServes = serves.get(uid);
            for(ServeEvent s: userServes){
                String storyID = s.getStoryID();
                Story story = DBStory.getStory(storyID);
                List<String> temp = new ArrayList<String>(story.getTags());
                if(tags.containsKey(temp)){
                    tags.put(temp, s.getTimespend()/300.0+tags.get(temp));
                }else{
                    tags.put(temp, s.getTimespend()/300.0);
                }
            }
            DBUser.updateUserInterest(uid, freq, tags);
        }
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to update user interests for "+lookbackMinute+" minutes: "+ String.valueOf(endtime-starttime));
        return serves.keySet();
    }

    private List<Story> calcualte(User user, List<Story> stories) {
        Long starttime = System.currentTimeMillis();
        Map<String, Double> interest = user.getInterests();
        if (interest.size() == 0)
            return stories;

        for (Story s : stories) {
            List<String> tags = s.getTags();
            s.setScore(s.getScore()*Utils.evaluateInterest(interest, tags));
        }
        Long endtime = System.currentTimeMillis();
        logger.debug("Time(ms) taken to calculate story point for user "+user.getUid()+": "+ String.valueOf(endtime-starttime));
        return stories;
    }

    public static void main(String args[]) throws InterruptedException {
        logger.trace("Entering application.");

        if(args.length!=1){
            logger.error("Please input the update freq in minuts");
            return;
        }
        int freq = Integer.parseInt(args[0]);
        
        PersonalizationAPI api = new PersonalizationAPI();

        Set<String> updatedUsers = api.updateUserInterests(freq);

        if (updatedUsers != null) {
            for (String uid : updatedUsers) {
                List<Story> stories = api.getUserStory(uid);
                api.storeUserStory(uid, stories);
            }
        }
    }

    private void storeUserStory(String uid, List<Story> stories) {
        DBUserStoryIndex.storeUserStory(uid, stories);
    }
}