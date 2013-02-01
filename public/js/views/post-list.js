var SR = SR || {};
SR.NO_POPUP = true;

SR.PostListView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    events: {
        "click .sr_thumbnail"   : "openModal"
    },

    render: function () {
        var posts = this.model.models;
//        var len = posts.length;
//        var startPos = (this.options.page - 1) * 8;
//        var endPos = Math.min(startPos + 8, len);
        var startPos = 0;
        var endPos = posts.length;

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new SR.PostListItemView({model: posts[i]}).render().el);
        }

//        $(this.el).append(new SR.Paginator({model: this.model, page: this.options.page}).render().el);



        return this;
    },

    openModal: function(evt){
        var post = this.model._byId[evt.currentTarget.id];
//        var post = new SR.Post({_id: evt.currentTarget.id});
        var postListView = this;

        if(!SR.NO_POPUP && post.get('content') !== null){
            post.fetch({
                success: function(model, response, options){
                    $(postListView.el).append(new SR.PostModalView({model: model}).render().el);
                    $('#myModal').modal({backdrop:true});

                    $('#myModal').on('hidden', function () {
                        $(this).remove();
                    });
                },
                error: function(model, xhr, options){
                    console.log(xhr);
                    if(xhr.status === 401 || xhr.responseText() === "unauthorized"){
                        SR.navigateHome();
                        SR.utils.showError({message: '用户会话超时，为了您的安全，请从新登录。'});
                    }
                }
            });
        }else{
            post.fetch({
                success: function(model, response, options){
                },
                error: function(model, xhr, options){
                    console.log(xhr);
                    if(xhr.status === 401 || xhr.responseText() === "unauthorized"){
                        SR.navigateHome();
                        SR.utils.showError({message: '用户会话超时，为了您的安全，请从新登录。'});
                    }
                }
            });
        }
    }
});

SR.PostListItemView = Backbone.View.extend({

    tagName: "li",
    className: "span4",

    initialize: function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    render: function () {
        var item = this.model.toJSON();
        item['description'] = item['description'].substr(0,120) + "...";
        item['mappingClass'] = SR.utils.getColorMappingClass(item['category']);

        $(this.el).html(this.template(item));
        return this;
    }

});