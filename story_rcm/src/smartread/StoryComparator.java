package smartread;

import java.util.Comparator;

public class StoryComparator implements Comparator<Story> {

    @Override
    public int compare(Story arg0, Story arg1) {
        return arg0.getScore().compareTo(arg1.getScore());
    }

}
