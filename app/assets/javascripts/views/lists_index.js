TrelloClone.Views.Lists = Backbone.View.extend({
  tagName: 'ul',
  template: JST['lists/index'],
  render: function () {
    var renderedContent = this.template({ lists: this.collection });
    this.$el.html(renderedContent);
    return this;
  },
  initialize: function () {
    // TODO: lists automatically re-render when ord is changed
    this.listenTo(this.collection, 'change', this.render)
  }
});