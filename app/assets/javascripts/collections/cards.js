TrelloClone.Collections.Cards = Backbone.Collection.extend({
  url: 'api/cards',
  model: TrelloClone.Models.Card
});

TrelloClone.Collections.cards = new TrelloClone.Collections.Cards();