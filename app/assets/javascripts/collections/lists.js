TrelloClone.Collections.Lists = Backbone.Collection.extend({
  url: 'api/lists',
  model: TrelloClone.Models.List,
  initialize: function () {
    this.comparator = 'ord'
  }
});

TrelloClone.Collections.lists = new TrelloClone.Collections.Lists();
