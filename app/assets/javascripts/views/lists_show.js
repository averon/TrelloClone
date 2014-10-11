TrelloClone.Views.ListShow = Backbone.CompositeView.extend({
  className: 'list',
  template: JST['lists/show'],
  render: function () {
    var renderedContent, cards, $listCards, $cardCreate;
    renderedContent = this.template({ list: this.model });
    this.$el.html(renderedContent);
    this.attachSubviews();

    return this;
  },
  initialize: function () {
    this.listenTo(this.collection, 'add', this.addCard);

    var view = this;

    this.collection.each(function (card) {
      view.addCard(card);
    });
  },
  events: {
    'click .new-card': 'newCard',
    'click .destroy-list': 'destroyList',
    
    // TODO: persist ord after drop
    'sortreceive .cards': 'sortReceive',
    'sortremove .cards': 'sortRemove',
    'sortstop .cards': 'saveCards'
  },
  addCard: function (card) {
    var cardShow = new TrelloClone.Views.CardShow({ model: card });
    this.listenTo(cardShow, 'removeCard', this.removeCard);
    this.addSubview('.cards', cardShow);
  },
  removeCard: function (card) {
    this.removeSubview('.cards', card);
  },
  destroyList: function () {
    this.model.destroy();
    this.trigger('removeList', this);
  },
  newCard: function (event) {
    event.preventDefault();
    PubSub.publish('newCard', this.model)
  },
  sortReceive: function (event, ui) {
    var $card = ui.item,
        cardId = $card.data('card-id'),
        newOrd = $card.index();
    var newCard = new TrelloClone.Models.Card({
      id: cardId,
      list_id: this.model.id,
      ord: newOrd
    });
    newCard.save();
    this.collection.add(newCard, { silent: true });
  },
  removeCard: function (event, ui) {
    var $card = ui.item,
        cardId = $card.data('card-id'),
        cardModel = this.collection.get(cardId);
    cardModel.destroyCard();
  },
  saveCards: function (event) {
    debugger;
//    var $list;
//    $list = $(event.currentTarget).find('li');
//    $list.each(function (idx, li) {
//    });
  }
});
