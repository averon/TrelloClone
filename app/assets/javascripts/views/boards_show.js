TrelloClone.Views.BoardShow = Backbone.CompositeView.extend({
  template: JST['boards/show'],
  render: function () {
    var renderedContent, lists, $boardLists;
    renderedContent = this.template({
      board: this.model
    });
    this.$el.html(renderedContent);
    this.attachSubviews();
   
    return this;
  },
  initialize: function () {
    this.listenTo(this.model.lists(), 'add', this.addList);
    this.newCardChannel = PubSub.subscribe('newCard', this.launchNewCardModal.bind(this));

    var view = this;
    this.model.lists().each(function (list) {
      view.addList(list);
    });
  },
  remove: function () {
    PubSub.unsubscribe(this.newCardChannel);
    Backbone.View.prototype.remove.call(this);
  },
  addList: function (list) {
    var listShow = new TrelloClone.Views.ListShow({ model: list });
    this.addSubview('.board-lists', listShow); 

    this.$('.cards').sortable({
      connectWith: this.$('.cards')
    });
    this.$('.board-lists').sortable();

    this.listenTo(listShow, 'removeList', this.removeList);
  },
  events: {
    'submit #new-list-form': 'createList',
  },
  launchNewCardModal: function (channel, list) {
    this.removeAllSubviews('.card-modal');
    var newCardView = new TrelloClone.Views.CardNew({ model: list });
    this.addSubview('.card-modal', newCardView);
    this.attachSubview('.card-modal', newCardView);
    this.$('#newCard').modal('show');
  },
  removeList: function (list) {
    this.removeSubview('.board-lists', list);
  },
  createList: function (event) {
    var view, params, newList;
    event.preventDefault();

    view = this;
    params = $(event.currentTarget).serializeJSON();
    params['list']['board_id'] = this.model.id;
    $(event.currentTarget).find('#new-list-title').val('');
    
    newList = new TrelloClone.Models.List(params['list']);
    newList.save({}, {
      success: function (response) {
        view.model.lists().add(response);
      }
    });
  }
});
