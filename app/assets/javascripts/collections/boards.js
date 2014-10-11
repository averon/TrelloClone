TrelloClone.Collections.Boards = Backbone.Collection.extend({
  url: 'api/boards',
  model: TrelloClone.Models.Board,
  getOrFetch: function (id) {
    var boards = this;
    var board = boards.get(id);
    if (!board) {
      board = new TrelloClone.Models.Board({ id: id });
    }
    board.fetch({
      success: function (response) {
        boards.add(response);
      }
    });
    return board;
  }
});

TrelloClone.Collections.boards = new TrelloClone.Collections.Boards();
