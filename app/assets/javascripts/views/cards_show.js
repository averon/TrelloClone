TrelloClone.Views.CardShow = Backbone.View.extend({
  tagName: 'li',
  className: 'card',
  template: JST['cards/show'],
  render: function () {
    var renderedContent = this.template({ card: this.model });
    this.$el.html(renderedContent);
    return this;
  }
});