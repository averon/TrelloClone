TrelloClone.Collections.Boards = Backbone.Collection.extend({
  url: 'api/boards',
  model: TrelloClone.Models.Board,
  getOrFetch: function (id) {
    var boards = this;
    var board = boards.get(id);
    if (board) {
      return board;
    } else {
      board = new TrelloClone.Models.Board({ id: id });
      board.fetch({
        success: function () {

        }
      });
    }
    return board;
  }
});

TrelloClone.Collections.boards = new TrelloClone.Collections.Boards();
