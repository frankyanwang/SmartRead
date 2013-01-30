package smartread.html;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import smartread.db.DBTags;
import smartread.tag.ExtractTags;

public class UpdateHotTag {
    private static final Logger logger = LogManager.getLogger(UpdateHotTag.class);

    /**
     * @param args
     */
    public static void main(String[] args) {

        try {
            ExtractTags et = new ExtractTags();
            HashSet<String> hs = new HashSet<String>();

            //Sogou
            Document doc = Jsoup.connect("http://top.sogou.com/hotword0.html").get();
            Elements links = doc.select("a");
            
            logger.debug("Total links from Sogou: "+links.size());
            for(Element link: links){
                String title = link.attr("title");
                if(title==null||title.length()==0)
                    continue;
                logger.debug(title);
                List<String> tags = et.getTags(title);
                logger.debug(tags);
                hs.addAll(tags);
            }
            
            //Baidu
            doc = Jsoup.connect("http://hot.news.baidu.com/").get();
            links = doc.select("a");
            logger.debug("Total links from Baidu: "+links.size());
            for(Element link: links){
                if(!link.attr("mon").equals("r=1"))
                    continue;
                logger.debug(link.text());
                List<String> tags = et.getTags(link.text());
                logger.debug(tags);
                hs.addAll(tags);
            }

            List<String> tags = new ArrayList<String>();
            tags.addAll(hs);
            DBTags.cleanTags();
            DBTags.addTags(tags);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
