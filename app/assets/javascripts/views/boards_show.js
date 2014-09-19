TrelloClone.Views.BoardShow = Backbone.View.extend({
  template: JST['boards/show'],
  render: function () {
    var renderedContent = this.template({
      board: this.model,
      lists: this.model.lists()
    });
    this.$el.html(renderedContent);
    return this;
  },
  initialize: function () {
    this.listenTo(this.model, 'sync', this.render);
    this.listenTo(this.model.lists(), 'add remove', this.render);
  },
  events: {
    'submit #new-list-form': 'createList',
    'click div.list button': 'destroyList'
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