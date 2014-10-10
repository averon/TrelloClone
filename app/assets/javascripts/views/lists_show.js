TrelloClone.Views.ListShow = Backbone.CompositeView.extend({
  className: 'list',
  template: JST['lists/show'],
  render: function () {
    var renderedContent, cards, $listCards, $cardCreate;
    renderedContent = this.template({ list: this.model });
    this.$el.html(renderedContent);
    this.attachSubviews();

    this.$('.cards').sortable({
      connectWith: $('.cards')
    });

   return this;
  },
  initialize: function () {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model.cards(), 'add', this.addCard);

    var view = this;
    cards = this.model.cards();
    cards.each(function (card) {
      view.addCard(card);
    });
  },
  events: {
    'click .new-card': 'newCard',
    'click .destroy-list': 'destroyList'
    // TODO: persist ord after drop
    // 'sortstop .cards': 'updateOrd'
  },
  addCard: function (card) {
    var cardShow = new TrelloClone.Views.CardShow({ model: card });
    this.listenTo(cardShow, 'removeCard', this.removeCard);
    this.addSubview('.cards', cardShow.render());
  },
  removeCard: function (card) {
    this.removeSubview('.cards', card);
    this.render();
  },
  destroyList: function () {
    this.model.destroy();
    this.trigger('removeList', this);
  },
  newCard: function (event) {
    event.preventDefault();
    PubSub.publish('newCard', this.model)
  },
  updateOrd: function (event) {
    var $list;
    $list = $(event.currentTarget).find('li');
    $list.each(function (li) {
      li.id
    });
  }
});
