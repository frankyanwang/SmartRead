var _ = require('underscore');

var Utils = {};

var moment = require('moment');
moment.lang('zh-cn');

module.exports = Utils;

var CATEGORY_MAPPING = {
    news:       "新闻",
    military:   "军事",
    finance:    "财经",
    web:        "互联网",
    realestate: "房产",
    car:        "汽车",
    sports:     "体育",
    entertain:  "娱乐",
    game:       "游戏",
    education:  "教育",
    women:      "女人",
    tech:       "科技",
    social:     "社会",
    fashion:    "时尚"
};

var CATEGORY_MAPPING_REVERSE = _.invert(CATEGORY_MAPPING);

var storyCount = 0;

var categoryCount = {
    news:       0,
    military:   0,
    finance:    0,
    web:        0,
    realestate: 0,
    car:        0,
    sports:     0,
    entertain:  0,
    game:       0,
    education:  0,
    women:      0,
    tech:       0,
    social:     0,
    fashion:    0
};

Utils.log = function(){
    console.log.apply(null,arguments);
};

Utils.logTime = function(msg, startTime){
    console.log(msg,": ",new Date().getTime()-startTime, "ms");
};

Utils.stringTrim =  function(str){
    var newStr = str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,'').replace(/\s+/g,' ');
    return newStr;
};

Utils.getTimeAgo = function(date){
    return moment(date).fromNow();
};

Utils.getCategoryMapping = function(){
    return CATEGORY_MAPPING;
};

Utils.filterSessionUser = function(user){
    return _.omit(user, 'pass','user');
};

Utils.isHexString24 = function(str){
    if (str.match(/^[0-9a-fA-F]+$/) && str.length === 24){
        return true;
    } else {
        return false;
    }
};

Utils.setTopStoriesCount = function(count){
    storyCount = count;
};

Utils.setCategoryCount = function (category, count){
    categoryCount[CATEGORY_MAPPING_REVERSE[category]] = count;
};

Utils.getTopStoriesCount = function(){
    return storyCount;
};

Utils.getCategoryCount = function(){
    return categoryCount;
}