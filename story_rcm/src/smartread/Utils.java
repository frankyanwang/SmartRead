package smartread;

import java.util.List;
import java.util.Map;

public class Utils {
    public static double evaluateInterest(Map<String, Double> userInterest,
            List<String> tags) {
        double multiplier = 1.0;
        for (String s : tags) {
            if (userInterest.containsKey(s)) {
                multiplier = multiplier
                        * (Math.sqrt(userInterest.get(s)) / 1000 + 1);
            }
        }
        return multiplier;
    }
}
