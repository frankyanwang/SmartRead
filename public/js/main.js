var SR = SR || {};

SR.navigateHome = function(){
    SR.clearUserCache();
    SR.app.navigate("home",{trigger:true});
};

SR.AppRouter = Backbone.Router.extend({

    routes: {
        ""                          : "list",
        "home"                      : "home",
        "signup/:email"             : "signup",
        "stories"	                : "list",
        "stories/page/:page"	    : "list",
        "stories/add"               : "addPost",
        "admin-stories/:id"         : "postDetails",
        "categories/:name"          : "listCategory",
        "admin-invite"              : "adminInviteList",
        "admin-stories"             : "adminStories",
        "admin-stories/page/:page"  : "adminStories",
        "admin-categories/:name"    : "adminCategory",
        "admin-categories/:name/page/:page"    : "adminCategory",
        "admin-tags"                : "adminTags",
        "about"                     : "about"
    },

    initialize: function () {
    },

    renderHeader: function(curCategory, noCache){
        curCategory = curCategory || "智能";
        if(!SR.getUserCache() || noCache === true){
            var request = $.ajax({
                url: "session",
                type: "GET",
                dataType: "json"
            });

            var headerData={curCategory: curCategory};
            var that = this;
            request.done(function(data) {
                headerData['user'] = data;
                SR.setUserCache(data);
                that.headerView = new SR.HeaderView({data: headerData});
                $('.header').html(that.headerView.el);
            });
            request.fail(function(jqXHR, textStatus) {
                headerData['user'] = undefined;
                that.headerView = new SR.HeaderView({data: headerData});
                $('.header').html(that.headerView.el);
            });

        }else{
            $("#categoryName").html(curCategory + ' <b class="caret">');
        }
    },

    setLoggedInHeader: function(){
        this.headerView = new SR.HeaderView();
        $('.header').html(this.headerView.el);
    },


    home: function (id) {
        this.renderHeader();
        if (!this.homeView) {
            this.homeView = new SR.HomeView();
        }
        $('#content').html(this.homeView.el);
        this.homeView.bindLogonjQueryForm();
        this.homeView.bindInvitejQueryForm();

//        this.headerView.selectMenuItem('home-menu');

        SR.utils.setBackgroundImage();
    },

    signup: function(email){
        this.renderHeader();
        if(!this.signupView){
            this.signupView = new SR.SignupView(decodeURIComponent(email));
        }
        $('#content').html(this.signupView.el);

        $('#name-tf').focus();
        this.signupView.bindSignupjQueryForm();

        $('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
        $('.modal-alert .modal-header h3').text('Success!');
        $('.modal-alert .modal-body p').html('Your account has been created.</br>Click OK to return to the login page.');

        SR.utils.setBackgroundImage();
    },

	list: function(page) {
        SR.utils.showInfo({message: "努力为您加载..."});
        this.renderHeader();
//        $("#categoryName").html("智能" + ' <b class="caret">');

        var p = page ? parseInt(page, 10) : 1;
        var postList = new SR.PostCollection();
        postList.fetch({
            success: function(model, response, options){
                $("#content").html(new SR.PostListView({model: postList, page: p}).el);

                SR.utils.hideNotification();
//                SR.app.headerView.selectMenuItem('dropdown-menu');
                $.backstretch("../css/img/paper.jpg");

            },
            error: function(model, xhr, options){
                if(xhr.status === 401){
                    SR.navigateHome();
                }
            }

        });
    },

    listCategory: function(name){
        SR.utils.showInfo({message: "努力为您加载..."});
        this.renderHeader(SR.utils.getCategoryMapping()[name]);

        var postList = new SR.PostCollection();
        postList.fetch({
            data: $.param({ category: name}),
            success: function(model, response, options){
                $(document).scrollTop(0);
                $("#content").html(new SR.PostListView({model: postList}).el);
            },
            error: function(model, xhr, options){
                if(xhr.status === 401){
                    SR.navigateHome();
                }
            }
        });

    },

    adminCategory: function(name, page){
        this.renderHeader();

        var p = page ? parseInt(page, 10) : 1;
        var postList = new SR.PostCollectionForAdmin();
        postList.fetch({
            data: $.param({ category: name, page: p, limit: SR.utils.getNumberPerPage()}),
            success: function(model, response, options){
                $(document).scrollTop(0);
                $("#content").html(new SR.AdminStoriesView({model: postList, page: p, origin: "admin-categories", category: name}).el);
            },
            error: function(model, xhr, options){
                if(xhr.status === 401){
                    SR.navigateHome();
                }
            }
        });
    },

    postDetails: function (id) {
        var post = new SR.PostForAdmin({_id: id});
        post.fetch({success: function(){
            $(document).scrollTop(0);
            $("#content").html(new SR.PostView({model: post}).el);
        }});
        //this.headerView.selectMenuItem();
    },

	addPost: function() {
        var post = new SR.Post();
        $('#content').html(new SR.PostView({model: post}).el);
        this.headerView.selectMenuItem('add-menu');
        $('.backstretch').remove();
	},

    about: function () {
        this.renderHeader();

        if (!this.aboutView) {
            this.aboutView = new SR.AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
        $('.backstretch').remove();
//        $('body').removeClass();
    },

    //admin functions.
    adminInviteList: function(){
        this.renderHeader();
        var inviteList = new SR.InviteCollection();
        inviteList.fetch({
            success: function(model, response, options){
                $("#content").html(new SR.AdminInviteUsersView({model: inviteList}).el);
            },
            error: function(model, xhr, options){
                if(xhr.status === 401){
                    SR.navigateHome();
                }
            }

        });
        $('.backstretch').remove();
    },

    adminStories: function(page){
        this.renderHeader();

        var p = page ? parseInt(page, 10) : 1;
        var postList = new SR.PostCollectionForAdmin();
        postList.fetch({
            data: $.param({ page: p, limit: SR.utils.getNumberPerPage()}),
            success: function(model, response, options){
                $(document).scrollTop(0);
                $("#content").html(new SR.AdminStoriesView({model: postList, page: p, origin: "admin-stories"}).el);
                SR.utils.hideNotification();

            },
            error: function(model, xhr, options){
                if(xhr.status === 401){
                    SR.navigateHome();
                }
            }

        });
    },

    adminTags: function(){
        this.renderHeader();

        var tagList = new SR.TagCollection();
        tagList.fetch({
            success: function(model, response, options){
                $(document).scrollTop(0);
                $("#content").html(new SR.AdminTagsView({model: tagList}).el);
                SR.utils.hideNotification();
            },
            error: function(model, xhr, options){
                if(xhr.status === 401){
                    SR.navigateHome();
                }
            }

        });
    }

});

SR.utils.loadTemplate(['HomeView', 'HeaderView', 'PostView', 'PostListItemView', 'AboutView','PostModalView','SignupView','AdminInviteUsersView','AdminStoriesView', 'AdminTagsView'], function() {
    SR.app = new SR.AppRouter();
    Backbone.history.start();
});