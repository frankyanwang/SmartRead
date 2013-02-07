package smartread;

import java.util.Map;

public class User {
    private Map<String, Double> interests; // tags and score
    private String uid;

    public User(String uid, Map<String, Double> interestes) {
        this.uid = uid;
        this.interests = interestes;
    }

    public Map<String, Double> getInterests() {
        return interests;
    }

    public String getUid() {
        return uid;
    }

    public void setInterests(Map<String, Double> interests) {
        this.interests = interests;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    @Override
    public String toString() {
        return "User ID: " + uid + "\nInterests: " + interests.toString();
    }

    public void updateInterests(String tag, Double score) {
        interests.put(tag, score);
    }
}
