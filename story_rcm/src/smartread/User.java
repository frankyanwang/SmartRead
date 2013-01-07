package smartread;

import java.util.Map;

public class User {
    private String uid;
    private Map<String, Double> interests; // tags and score

    public User(String uid, Map<String, Double> interestes) {
        this.uid = uid;
        this.interests = interestes;
    }

    public Map<String, Double> getInterests() {
        return interests;
    }

    public void setInterests(Map<String, Double> interests) {
        this.interests = interests;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public void updateInterests(String tag, Double score) {
        interests.put(tag, score);
    }

    public String toString() {
        return "User ID: " + uid + "\nInterests: " + interests.toString();
    }
}
