var SR = SR || {};

SR.AdminStoriesView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        var stories = this.model.models;
        var category = this.options['category'];
        var storyCount = parseInt(stories.pop().get("storyCount"), 10);
        var catCount = parseInt(stories.pop().get("categoryCount")[category], 10);
        //var num = SR.utils.getNumberPerPage();
        //var startPos = (this.options.page-1)*num;
        //var endPos = Math.min(startPos + num, len);

        $(this.el).html(this.template({
            action: this.model.toJSON()
        }));

        $(this.el).append(new SR.Paginator({model: this.model, extras: this.options, sCount: storyCount, cCount: catCount }).render().el);

        return this;
    },

    events: {
        "click .edit": "editStory",
        "click .delete": "deleteStory"
    },

    editStory: function(evt){
        var id = $(evt.target).data('id');
        SR.app.navigate("admin-stories/" + id, {trigger: true});
    },

    deleteStory: function (evt) {
        var self = this;
        var id = $(evt.target).data('id');
        var stories = this.model;

        stories.get(id).destroy({
            success: function () {
                alert('Story deleted successfully');
                self.render();
            }
        });
    }
});