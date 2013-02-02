var SR = SR || {};

(function(){

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

var NUM_PER_PAGE = 100;

SR.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplate: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            //check if backbone view are initialized.
            if (SR[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    SR[view].prototype.template = _.template(data);
                }));
            } else {
                alert(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },

    showSuccess: function(option){
        var DEFAULT_OPTION = {
            message: { text: 'Operation executed successfully!' },
            type: "success",
            fadeOut: { enabled: true, delay: 3000 }
            };

        var newOption = $.extend({},DEFAULT_OPTION,option);
        $('.notifications').notify(newOption).show();
    },

    showInfo: function(option){
        var DEFAULT_OPTION = {
            message: { text: 'Loading ...' },
            type: "info",
            fadeOut: { enabled: true, delay: 2000 }
        };

        var newOption = $.extend({},DEFAULT_OPTION,option);
        $('.notifications').notify(newOption).show();
    },

    showError: function(option){
//        {html: true, message: msg, type: "error",delay:6000,fadeOut: { enabled: false, delay: 3000 }}
        var DEFAULT_OPTION = {
            message: { text: 'Operation executed successfully!' },
            type: "error",
            fadeOut: { enabled: false, delay: 3000 }
        };

        var newOption = $.extend({},DEFAULT_OPTION,option);
        $('.notifications').notify(newOption).show();
    },

    showSystemError: function(option){
        var DEFAULT_OPTION = {
            message: { text: '对不起，系统异常，请稍后再尝试！' },
            type: "error",
            fadeOut: { enabled: true, delay: 5000 }
        };

        var newOption = $.extend({},DEFAULT_OPTION,option);
        $('.notifications').notify(newOption).show();
    },

    hideNotification: function(){
        $('.notifications').empty();
    },

    disableButton: function(button, label){
        button.attr("disabled", "disabled");
        button.text(label);
    },

    enableButton: function(button, label){
        button.removeAttr("disabled");
        button.text(label);
    },

    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
    },

    addValidationError: function (field, message) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.addClass('error');
        $('.help-inline', controlGroup).html(message);
    },

    removeValidationError: function (field) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.removeClass('error');
        $('.help-inline', controlGroup).html('');
    },

    showAlert: function(title, text, klass) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(klass);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();
    },

    hideAlert: function() {
        $('.alert').hide();
    },

    getColorMappingClass: function(category){
        var colorMap = CATEGORY_MAPPING_REVERSE[category];

        return colorMap ? "color-" + colorMap : undefined;
    },

    getCategoryMapping: function(){
        return CATEGORY_MAPPING;
    },

    setBackgroundImage: function(){
        $.backstretch([
            "../css/img/bing_bg.jpg",
            "../css/img/bing_bg1.jpg",
            "../css/img/bing_bg2.jpg",
            "../css/img/bg2.jpg"
        ], {duration: 5000, fade: 1000});
    },

    getNumberPerPage: function(){
        return NUM_PER_PAGE;
    }
};

})();