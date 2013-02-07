package smartread;

public class ServeEvent {
    String storyID;
    String tags;
    int timespend;
    String uid;

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

    public String getTags() {
        return tags;
    }

    public int getTimespend() {
        return timespend;
    }

    public String getUid() {
        return uid;
    }

    public void setStoryID(String storyID) {
        this.storyID = storyID;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public void setTimespend(int timespend) {
        this.timespend = timespend;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

}
