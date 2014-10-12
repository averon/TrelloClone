TrelloClone.Collections.Cards = Backbone.Collection.extend({
  url: 'api/cards',
  model: TrelloClone.Models.Card,
  initialize: function () {
    this.comparator = 'ord'
  }
});

TrelloClone.Collections.cards = new TrelloClone.Collections.Cards();
