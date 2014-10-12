TrelloClone.Views.ListShow = Backbone.CompositeView.extend({
  className: 'list',
  template: JST['lists/show'],
  render: function () {
    var renderedContent, cards, $listCards, $cardCreate;
    renderedContent = this.template({ list: this.model });
    this.$el.html(renderedContent);
    this.attachSubviews();
    this.resortSubviews();

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
    console.log('sortReceive');
    var $card = ui.item,
        cardId = $card.data('card-id'),
        newOrd = $card.index();

    var newCard = new TrelloClone.Models.Card({
      id: cardId,
      list_id: this.model.id,
      ord: newOrd
    });

    newCard.save({}, {
      success: function (response) {
        var cardView = new TrelloClone.Views.CardShow({ model: response });
        this.collection.add(response, { silent: true });
        this.subviews('.cards').push(cardView);

        event.stopPropagation();
        this.saveCards();
      }.bind(this)
    });
  },
  sortRemove: function (event, ui) {
    console.log('sortRemove');
    var $list = $(event.currentTarget);
        $card = ui.item,
        cardId = $card.data('card-id'),
        cardModel = this.collection.get(cardId);
        cardView = _.findWhere(this.subviews('.cards'), {model: cardModel});
        subviews = this.subviews('.cards');
    this.collection.remove(cardModel);
    subviews.splice(subviews.indexOf(cardView), 1);
 
    event.stopPropagation();
    this.saveCards();
  },
  saveCards: function () {
    var $list = this.$('.cards'),
        $cards = $list.find('li');
    console.log('saveCards (' + $list.parent().find('h3').html() + ')');

    $cards.each(function (idx, card) {
      var cardId = $(card).data('card-id'),
          cardModel = this.collection.get(cardId);
      if (cardModel.get('ord') === idx) { return; }

      cardModel.save({ ord: idx });
    }.bind(this));

    this.resortSubviews();
  },
  resortSubviews: function () {
    console.log('resortSubviews');
    this.subviews('.cards').sort(function (subview_a, subview_b) {
      return subview_a.model.get('ord') - subview_b.model.get('ord');
    });
  }
});
