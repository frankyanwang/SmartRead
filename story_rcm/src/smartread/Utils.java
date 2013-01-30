package smartread;

import java.util.List;
import java.util.Map;

public class Utils {
    public static double evaluateInterest(Map<String, Double> userInterest,
            List<String> tags) {
        double multiplier = 1.0;
        for (String s : tags) {
            if (userInterest.containsKey(s)) {
                multiplier = multiplier * (userInterest.get(s)/1000.0 + 1);
            }
        }
        return multiplier;
    }
}
