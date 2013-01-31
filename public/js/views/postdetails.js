var SR = SR || {};

SR.PostView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deletePost",
        "drop #picture" : "dropHandler"
    },

    change: function (event) {
        // Remove any existing alert message
        SR.utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        if (target.name === "tags") {
            var tags = target.value.split(" ");
            change["tags"] = tags;
        } else{
            change[target.name] = target.value;
        }
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            SR.utils.addValidationError(target.id, check.message);
        } else {
            SR.utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            SR.utils.displayValidationErrors(check.messages);
            return false;
        }
        this.savePost();
        return false;
    },

    savePost: function () {
        var self = this;
        console.log('ADMIN: Before save');
        this.model.save(null, {
            success: function (model) {
                console.log('ADMIN: Successfully saved');
                self.render();
                SR.app.navigate('admin-stories/' + model.id, false);
                SR.utils.showAlert('Success!', 'Story saved successfully', 'alert-success');
            },
            error: function () {
                SR.utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deletePost: function () {
        this.model.destroy({
            success: function () {
                alert('Story deleted successfully');
                window.history.back();
            }
        });
        return false;
    },

    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }
});