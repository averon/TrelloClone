TrelloClone.Collections.Boards = Backbone.Collection.extend({
  url: 'api/boards',
  model: TrelloClone.Models.Board,
  getOrFetch: function (id) {
    var board = this.get(id);
    if (!board) {
      // TODO: success handler - add to collection after successful fetch
      board = new TrelloClone.Models.Board({ id: id });
    }
    board.fetch();
    return board;
  }
});

TrelloClone.Collections.boards = new TrelloClone.Collections.Boards();