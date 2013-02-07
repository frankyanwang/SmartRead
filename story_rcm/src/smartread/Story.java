package smartread;

import java.util.Date;
import java.util.List;

public class Story {
    private Double bScore;
    private Double nScore;
    private Date pubDate;
    private String storyID;
    private List<String> tags;

    public Story(String storyID, Double score, List<String> tags, Date pubDate) {
        super();
        this.storyID = storyID;
        this.tags = tags;
        this.bScore = score;
        this.pubDate = pubDate;
    }

    public Double getBScore() {
        return bScore;
    }

    public Double getNScore() {
        return nScore;
    }

    public Date getPubDate() {
        return pubDate;
    }

    public String getStoryID() {
        return storyID;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setBScore(Double bScore) {
        this.bScore = bScore;
    }

    public void setNScore(Double nScore) {
        this.nScore = nScore;
    }

    public void setPubDate(Date pubDate) {
        this.pubDate = pubDate;
    }

    public void setStoryID(String storyID) {
        this.storyID = storyID;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    @Override
    public String toString() {
        return "StoryID: " + storyID + "\nbScore: " + bScore + "\nTags: "
                + tags.toString();
    }
}
