TrelloClone.Views.BoardShow = Backbone.View.extend({
  // TODO: fix rendering lists - occurs 3x more than it should.
  template: JST['boards/show'],
  render: function () {
    var renderedContent, lists, $boardLists;
    renderedContent = this.template({
      board: this.model
    });
    this.$el.html(renderedContent);
    
    $boardLists = this.$('.board-lists');
    
    lists = this.model.lists();
    lists.each(function (list) {
      var listShow = new TrelloClone.Views.ListShow({ model: list });
      renderedContent = listShow.render().$el
      $boardLists.append(renderedContent);
    });
    
    this.$('.cards').sortable({
      connectWith: $('.cards')
    });
    
    this.$('.board-lists').sortable();
        
    return this;
  },
  initialize: function () {
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.lists(), 'add remove', this.render);
  },
  events: {
    'submit #new-list-form': 'createList',
    'click .list .delete': 'destroyList'
  },
  createList: function (event) {
    var params, newList, lists;
    event.preventDefault();
    
    params = $(event.currentTarget).serializeJSON();
    params['list']['board_id'] = this.model.id;

    lists = this.model.lists();

    newList = new TrelloClone.Models.List(params['list']);
    newList.save({}, {
      success: function (response) {
        lists.add(response);
      }
    });
  },
  destroyList: function (event) {
    event.preventDefault();
    
    var id = event.currentTarget.id;
    var list = this.model.lists().get(id);
    list.destroy();
  }
});
