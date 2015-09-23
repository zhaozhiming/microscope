Template.postEdit.onCreated(function() {
  Session.set('postSubmitErrors', {});
});
Template.postEdit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    var currentPostId = this._id;
    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    var errors = validatePost(postProperties);
    if (errors.title || errors.url) return Session.set('postSubmitErrors', errors);

    var postWithSameLink = Posts.findOne({_id: {$ne: currentPostId}, url: postProperties.url});
    if (postWithSameLink) {
      return throwError('url is already exists');
    }
    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
      // 向用户显示错误信息
        throwError(error.reason);
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
        Router.go('home');
      }
    }
 });

