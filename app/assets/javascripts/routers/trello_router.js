TrelloClone.Routers.TrelloRouter = Backbone.Router.extend({
  routes: {
    '': 'boardIndex',
    'boards/:id': 'boardShow'
  },
  
  boardIndex: function () {
    TrelloClone.Collections.boards.fetch();

    var indexView = new TrelloClone.Views.BoardIndex({
      collection: TrelloClone.Collections.boards
    });
    
    this._swapView(indexView);
  },
  
  boardShow: function (id) {
    var board = TrelloClone.Collections.boards.getOrFetch(id);
    var lists = board.lists();
    var showView = new TrelloClone.Views.BoardShow({ model: board, collection: lists });
    this._swapView(showView);

    $('#main .cards').sortable({
      connectWith: $('#main .cards')
    });
    $('#main .board-lists').sortable();
  },
  
  _swapView: function (newView) {
    this._currentView && this._currentView.remove();
    this._currentView = newView;
    $('#main').html(this._currentView.render().$el);
  }
});
