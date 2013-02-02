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