package smartread;

import java.util.List;

public class Story {
    private String storyID;
    private List<String> tags;
    private Double score;

    public Story(String storyID, Double score, List<String> tags) {
        super();
        this.storyID = storyID;
        this.tags = tags;
        this.score = score;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getStoryID() {
        return storyID;
    }

    public void setStoryID(String storyID) {
        this.storyID = storyID;
    }

    public String toString() {
        return "StoryID: " + storyID + "\nScore: " + score + "\nTags: "
                + tags.toString();
    }
}
