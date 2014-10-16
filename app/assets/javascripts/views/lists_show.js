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
  attributes: function () {
    return {
      'data-list-id': this.model.id
    }
  },
  initialize: function () {
    this.listenTo(this.collection, 'add', this.addCard);

    this.showTitle = PubSub.subscribe('showTitle', this.showTitle.bind(this));

    var view = this;

    this.collection.each(function (card) {
      view.addCard(card);
    });
  },
  events: {
    'click .new-card-placeholder': 'showNewCard',
    'click .close-new-card': 'hideNewCard',
    'click .destroy-list': 'destroyList',
    'click .list-title h3': 'editTitle',
    
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
  showNewCard: function (event) {
    event.preventDefault();
    var newCard = new TrelloClone.Views.CardNew({ model: this.model });
    this.$('.new-card').empty();
    this.addSubview('.new-card', newCard);
    this.listenTo(newCard, 'hideNewCardView', this.hideNewCard);
  },
  hideNewCard: function () {
    this.$('.new-card').html('<div class="new-card-placeholder">Add card...</div>') 
  },
  editTitle: function () {
    var titleEdit = new TrelloClone.Views.TitleEdit({ model: this.model });
    this.$('.list-title').empty();
    this.addSubview('.list-title', titleEdit);
  },
  showTitle: function () {
    this.$('.list-title').html('<h3>' + this.model.escape('title') + '</h3>');
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

    $cards.each(function (idx, card) {
      var cardId = $(card).data('card-id'),
          cardModel = this.collection.get(cardId);
      if (cardModel.get('ord') === idx) { return; }

      cardModel.save({ ord: idx });
    }.bind(this));

    this.resortSubviews();
  },
  resortSubviews: function () {
    this.subviews('.cards').sort(function (subview_a, subview_b) {
      return subview_a.model.get('ord') - subview_b.model.get('ord');
    });
  }
});
