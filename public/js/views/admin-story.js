var SR = SR || {};

SR.AdminStoriesView = Backbone.View.extend({

    initialize:function () {
        this.render();
    },

    render:function () {
        var stories = this.model.models;
        $(this.el).html(this.template({
            action: this.model.toJSON()
        }));
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