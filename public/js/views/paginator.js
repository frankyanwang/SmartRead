var SR = SR || {};

SR.Paginator = Backbone.View.extend({

    className: "pagination pagination-centered",

    initialize:function () {
        this.model.bind("reset", this.render, this);
        this.render();
    },

    render:function () {

        //var items = this.model.models;
        var sLen = this.options.sCount;
        var len = this.options.cCount ? this.options.cCount : sLen;

        var pageCount = Math.ceil(len / SR.utils.getNumberPerPage());
        var category = this.options.extras.category ? this.options.extras.category + "/" :  "";
        var url = "#" + this.options.extras.origin + "/" + category + "page/";

        $(this.el).html('<ul />');

        for (var i=0; i < pageCount; i++) {
            $('ul', this.el).append("<li" + ((i + 1) === this.options.extras.page ? " class='active'" : "") + "><a href='" + url + (i+1)+"'>" + (i+1) + "</a></li>");
        }

        return this;
    }
});