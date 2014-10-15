TrelloClone.Views.CardShow = Backbone.View.extend({
  tagName: 'li',
  className: 'card',
  template: JST['cards/show'],
  render: function () {
    var renderedContent = this.template({ card: this.model });
    this.$el.html(renderedContent);

    return this;
  },
  attributes: function () {
    return {
      'data-card-id': this.model.id
    }
  },
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
  },
  events: {
    'click': 'launchCardDetail',
//    'click .destroy-card': 'destroyCard',
  },
//  destroyCard: function () {
//    this.model.destroy();
//    this.trigger('removeCard', this);
//  },
  launchCardDetail: function () {
    PubSub.publish('launchCardDetail', this.model);
  }
});
