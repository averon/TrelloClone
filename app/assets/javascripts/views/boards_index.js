TrelloClone.Views.BoardIndex = Backbone.View.extend({
  tagName: "ul",
  template: JST['boards/index'],
  render: function () {
    var renderedContent = this.template({ boards: this.collection });
    this.$el.html(renderedContent);
    return this
  },
  initialize: function () {
    this.listenTo(this.collection, 'add', this.render);
  },
  events: {
    'submit #new-board-form': "submit"
  },
  submit: function (event) {
    event.preventDefault();
    
    var view = this;
    var params = $(event.currentTarget).serializeJSON();
    var newBoard = new TrelloClone.Models.Board(params['board']);
    
    newBoard.save({}, {
      success: function (response) {
        view.collection.add(response);
        // TODO: add { trigger: true } as second argument to navigate
        Backbone.history.navigate('#/boards/' + response.id);
      }
    });
  }
});