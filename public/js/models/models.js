var SR = SR || {};

SR.Post = Backbone.Model.extend({

    urlRoot: "/stories",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: "",
        author: "",
        comments: "",
        content: "",
        description: "",
        link: "",
        pubDate: "",
        source: "",
        category: "",
        tags: [],
        picture: null
    }
});

SR.PostCollection = Backbone.Collection.extend({

    model: SR.Post,
//    comparator: function(item) {
//        return -item.get('score');
//    },
    url: "/stories"

});

//=================================
// For Admin user
SR.PostForAdmin = Backbone.Model.extend({

    urlRoot: "/admin-stories",

    idAttribute: "_id",

    initialize: function () {
        this.validators = {};

        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};

        for (var key in this.validators) {
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }

        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        name: "",
        author: "",
        comments: "",
        content: "",
        description: "",
        link: "",
        pubDate: "",
        source: "",
        category: "",
        tags: [],
        picture: null
    }
});

SR.PostCollectionForAdmin = Backbone.Collection.extend({

    model: SR.PostForAdmin,
//    comparator: function(item) {
//        return -item.get('score');
//    },
    url: "/admin-stories"

});

SR.Invite = Backbone.Model.extend({
    urlRoot: "/invite-users",
    idAttribute: "_id",
    initialize: function(){

    },
    defaults: {
        _id: null,
        email: null,
        isInvited: false
    }
});

SR.InviteCollection = Backbone.Collection.extend({

    model: SR.Invite,

    url: "/invite-users"

});