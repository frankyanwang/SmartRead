package smartread;

public class ServeEvent {
    String storyID;
    String uid;
    String tags;
    int timespend;

    public ServeEvent(String storyID, String uid, String tags, int timespend) {
        super();
        this.storyID = storyID;
        this.uid = uid;
        this.tags = tags;
        this.timespend = timespend;
    }

    public String getStoryID() {
        return storyID;
    }

    public void setStoryID(String storyID) {
        this.storyID = storyID;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public int getTimespend() {
        return timespend;
    }

    public void setTimespend(int timespend) {
        this.timespend = timespend;
    }
    
}
