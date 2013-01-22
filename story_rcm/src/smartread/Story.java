package smartread;

import java.util.List;

public class Story {
    private String storyID;
    private List<String> tags;
    private Double bScore;
    private Double nScore;

    public Story(String storyID, Double score, List<String> tags) {
        super();
        this.storyID = storyID;
        this.tags = tags;
        this.bScore = score;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public String getStoryID() {
        return storyID;
    }

    public void setStoryID(String storyID) {
        this.storyID = storyID;
    }

    @Override
    public String toString() {
        return "StoryID: " + storyID + "\nbScore: " + bScore + "\nTags: "
                + tags.toString();
    }

    public Double getBScore() {
        return bScore;
    }

    public void setBScore(Double bScore) {
        this.bScore = bScore;
    }

    public Double getNScore() {
        return nScore;
    }

    public void setNScore(Double nScore) {
        this.nScore = nScore;
    }
}
