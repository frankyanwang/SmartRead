var config = {};
module.exports = config;

//Test individual purpose
//config.sites = {
//    news:[
//        "http://www.madimalo.com"
//    ]
//};

config.sites = {

    news:[
        "http://nbweekly.feedsportal.com/c/34905/f/643776/index.rss",
    ],

    sports:[],

    tech:[
        "http://tech2ipo.com/feed",
        "http://www.ifanr.com/feed",
        "http://www.36kr.com/feed",
        "http://feed.feedsky.com/pingwest"
//		"http://www.leiphone.com/feed", //not working with image and link
//		"http://feeds.geekpark.net" //not working with image
    ],

    web:[],

    fashion:[
        "http://www.fashiondes.com/rss"
    ],

    education:[],

    movie:[
        "http://smweekly.feedsportal.com/c/35020/f/646841/index.rss"
//        "http://news.baidu.com/n?cmd=1&class=enternews&tn=rss"
    ],

    finance:[]
};

config.baidu_feeds = {
    //新闻
    "http://news.baidu.com/n?cmd=1&class=civilnews&tn=rss": "新闻, 国内新闻",
    "http://news.baidu.com/n?cmd=1&class=taiwan&tn=rss": "新闻, 国内新闻, 台湾新闻",
    "http://news.baidu.com/n?cmd=1&class=gangaotai&tn=rss": "新闻, 国内新闻, 港澳新闻",
    "http://news.baidu.com/n?cmd=1&class=internews&tn=rss": "新闻, 国际新闻",
    "http://news.baidu.com/n?cmd=1&class=hqsy&tn=rss": "新闻, 国际新闻, 视野",
    "http://news.baidu.com/n?cmd=1&class=renwu&tn=rss": "新闻, 国际新闻, 人物",
     //军事
    "http://news.baidu.com/n?cmd=1&class=mil&tn=rss": "军事",
    "http://news.baidu.com/n?cmd=1&class=zhongguojq&tn=rss": "军事, 中国军事",
    "http://news.baidu.com/n?cmd=1&class=taihaijj&tn=rss": "军事, 台海军事",
    "http://news.baidu.com/n?cmd=1&class=guojijq&tn=rss": "军事, 国际军事",
    //财经
    "http://news.baidu.com/n?cmd=1&class=finannews&tn=rss": "财经",
    "http://news.baidu.com/n?cmd=1&class=stock&tn=rss": "财经, 股票",
    "http://news.baidu.com/n?cmd=1&class=money&tn=rss": "财经, 理财",
    "http://news.baidu.com/n?cmd=1&class=hongguan&tn=rss": "财经, 宏观",
    "http://news.baidu.com/n?cmd=1&class=chanye&tn=rss": "财经, 产业",
    //
    "http://news.baidu.com/n?cmd=1&class=internet&tn=rss": "互联网",
    "http://news.baidu.com/n?cmd=1&class=rwdt&tn=rss": "互联网, 人物",
    "http://news.baidu.com/n?cmd=1&class=gsdt&tn=rss": "互联网, 公司",
    "http://news.baidu.com/n?cmd=1&class=search_engine&tn=rss": "互联网, 搜索",
    "http://news.baidu.com/n?cmd=1&class=e_commerce&tn=rss": "互联网, 电子商务",
    "http://news.baidu.com/n?cmd=1&class=online_game&tn=rss": "互联网, 网络游戏",
    //房产
    "http://news.baidu.com/n?cmd=1&class=housenews&tn=rss": "房产",
    "http://news.baidu.com/n?cmd=1&class=gddt&tn=rss": "房产, 各地动态",
    "http://news.baidu.com/n?cmd=1&class=zcfx&tn=rss": "房产, 政策风向",
    "http://news.baidu.com/n?cmd=1&class=shichangzoushi&tn=rss": "房产, 市场走向",
    "http://news.baidu.com/n?cmd=1&class=fitment&tn=rss": "房产, 家居",
    //汽车
    "http://news.baidu.com/n?cmd=1&class=autonews&tn=rss": "汽车",
    "http://news.baidu.com/n?cmd=1&class=autobuy&tn=rss": "汽车, 新车",
    "http://news.baidu.com/n?cmd=1&class=daogou&tn=rss": "汽车, 导购",
    "http://news.baidu.com/n?cmd=1&class=hangqing&tn=rss": "汽车, 行情",
    "http://news.baidu.com/n?cmd=1&class=weixiu&tn=rss": "汽车, 保养, 维修",
    //体育
    "http://news.baidu.com/n?cmd=1&class=sportnews&tn=rss": "体育",
    "http://news.baidu.com/n?cmd=1&class=nba&tn=rss": "体育, 篮球, NBA",
    "http://news.baidu.com/n?cmd=1&class=worldsoccer&tn=rss": "体育, 足球, 国际足球",
    "http://news.baidu.com/n?cmd=1&class=chinasoccer&tn=rss": "体育, 足球, 国内足球",
    "http://news.baidu.com/n?cmd=1&class=cba&tn=rss": "体育, 篮球, CBA",
    "http://news.baidu.com/n?cmd=1&class=othersports&tn=rss": "体育, 综合",
    //娱乐
    "http://news.baidu.com/n?cmd=1&class=enternews&tn=rss": "娱乐",
    "http://news.baidu.com/n?cmd=1&class=star&tn=rss": "娱乐, 明星",
    "http://news.baidu.com/n?cmd=4&class=film&tn=rss": "娱乐, 电影",
    "http://news.baidu.com/n?cmd=4&class=tv&tn=rss": "娱乐, 电视",
    "http://news.baidu.com/n?cmd=4&class=music&tn=rss": "娱乐, 音乐",
    "http://news.baidu.com/n?cmd=4&class=zongyi&tn=rss": "娱乐, 综艺",
    "http://news.baidu.com/n?cmd=4&class=yanchu&tn=rss": "娱乐, 演出",
    "http://news.baidu.com/n?cmd=4&class=jiangxiang&tn=rss": "娱乐, 奖项",
    //游戏
    "http://news.baidu.com/n?cmd=1&class=gamenews&tn=rss": "游戏",
    "http://news.baidu.com/n?cmd=4&class=netgames&tn=rss": "游戏, 网络游戏",
    "http://news.baidu.com/n?cmd=4&class=tvgames&tn=rss": "游戏, 电视游戏",
    "http://news.baidu.com/n?cmd=4&class=dianzijingji&tn=rss": "游戏, 电子竞技",
    "http://news.baidu.com/n?cmd=4&class=remenyouxi&tn=rss": "游戏, 热门游戏",
    "http://news.baidu.com/n?cmd=4&class=WOW&tn=rss": "游戏, 魔兽世界",
    //教育
    "http://news.baidu.com/n?cmd=1&class=edunews&tn=rss": "教育",
    "http://news.baidu.com/n?cmd=4&class=exams&tn=rss": "教育, 考试",
    "http://news.baidu.com/n?cmd=4&class=abroad&tn=rss": "教育, 留学",
    "http://news.baidu.com/n?cmd=4&class=jiuye&tn=rss": "教育, 就业",
    //健康
    "http://news.baidu.com/n?cmd=1&class=healthnews&tn=rss": "女人",
    "http://news.baidu.com/n?cmd=4&class=chaoliufs&tn=rss": "女人, 潮流服饰",
    "http://news.baidu.com/n?cmd=4&class=meironghf&tn=rss": "女人, 美容护肤",
    "http://news.baidu.com/n?cmd=4&class=jianfei&tn=rss": "女人, 减肥减身",
    "http://news.baidu.com/n?cmd=4&class=qinggan&tn=rss": "女人, 情感两性",
    "http://news.baidu.com/n?cmd=4&class=jiankang&tn=rss": "女人, 健康养生",
    //科技
    "http://news.baidu.com/n?cmd=1&class=technnews&tn=rss": "科技",
    "http://news.baidu.com/n?cmd=4&class=cell&tn=rss": "科技, 手机",
    "http://news.baidu.com/n?cmd=4&class=digital&tn=rss": "科技, 数码",
    "http://news.baidu.com/n?cmd=4&class=computer&tn=rss": "科技, 电脑",
    "http://news.baidu.com/n?cmd=4&class=discovery&tn=rss": "科技, 科普",
    //社会
    "http://news.baidu.com/n?cmd=1&class=socianews&tn=rss": "社会",
    "http://news.baidu.com/n?cmd=4&class=shyf&tn=rss": "社会, 社会与法",
    "http://news.baidu.com/n?cmd=4&class=shwx&tn=rss": "社会, 社会万象",
    "http://news.baidu.com/n?cmd=4&class=zqsk&tn=rss": "社会, 真情时刻",
    "http://news.baidu.com/n?cmd=4&class=qwys&tn=rss": "社会, 奇闻异事"
};
