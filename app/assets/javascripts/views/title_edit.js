TrelloClone.Views.TitleEdit = Backbone.View.extend({
  className: 'form',
  template: JST['title_edit'],
  render: function () {
    var renderedContent = this.template({ model: this.model });
    this.$el.html(renderedContent);
    return this;
  },
  events: {
    'click .update-title': 'updateTitle',
    'click .close-edit-title': 'closeEditTitle'
  },
  updateTitle: function (event) {
    var newTitle = this.$('textarea').val();

    if (newTitle !== '') {
      this.model.save({ title: newTitle });
      this.closeEditTitle();
    }
  },
  closeEditTitle: function () {
    PubSub.publish('showTitle');
  }
});
