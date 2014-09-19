TrelloClone.Models.Board = Backbone.Model.extend({
  urlRoot: 'api/boards',
  
  lists: function () {
    if (!this._lists) {
      this._lists = new TrelloClone.Collections.Lists();
      this._lists.comparator = 'ord';
    }
    return this._lists;
  },
  
  parse: function (response, options) {
    if (response.lists) {
      this.lists().set(response.lists);
      delete response.lists;
    }
    return response;
  }
});