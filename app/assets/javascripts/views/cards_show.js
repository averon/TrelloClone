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
    this.destroyCardChannel = PubSub.subscribe('destroyCard', this.destroyCard.bind(this));
  },
  remove: function () {
    PubSub.unsubscribe(this.destroyCardChannel);
    Backbone.View.prototype.remove.call(this);
  },
  events: {
    'click': 'launchCardDetail',
  },
  destroyCard: function (channel, card) {
    if (card.id === this.model.id) {
      this.model.destroy();
      this.trigger('removeCard', this);
    }
  },
  launchCardDetail: function () {
    PubSub.publish('launchCardDetail', this.model);
  }
});
