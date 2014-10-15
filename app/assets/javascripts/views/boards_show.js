TrelloClone.Views.BoardShow = Backbone.CompositeView.extend({
  template: JST['boards/show'],
  render: function () {
    var renderedContent, lists, $boardLists;
    renderedContent = this.template({
      board: this.model
    });
    this.$el.html(renderedContent);
    this.resortSubviews();
    this.attachSubviews();
   
    return this;
  },
  initialize: function () {
    this.listenTo(this.model.lists(), 'add', this.addList);
//    this.newCardChannel = PubSub.subscribe('newCard', this.launchNewCardModal.bind(this));
    this.showCardChannel = PubSub.subscribe('launchCardDetail', this.launchCardDetail.bind(this));

    var view = this;
    this.model.lists().each(function (list) {
      view.addList(list);
    });
  },
  remove: function () {
    PubSub.unsubscribe(this.newCardChannel);
    PubSub.unsubscribe(this.showCardChannel);
    Backbone.View.prototype.remove.call(this);
  },
  addList: function (list) {
    var listShow = new TrelloClone.Views.ListShow({ model: list, collection: list.cards() });
    this.addSubview('.board-lists', listShow); 

    this.$('.cards').sortable({
      connectWith: this.$('.cards')
    });
    this.$('.board-lists').sortable();

    this.listenTo(listShow, 'removeList', this.removeList);
  },
  events: {
    'submit #new-list-form': 'createList',
    'sortstop .board-lists': 'saveLists'
  },
  launchNewCardModal: function (channel, list) {
    this.removeAllSubviews('.card-modal');
    var newCardView = new TrelloClone.Views.CardNew({ model: list });
    this.addSubview('.card-modal', newCardView);
    this.attachSubview('.card-modal', newCardView);
    this.$('#newCard').modal('show');
  },
  launchCardDetail: function (channel, card) {
    this.removeAllSubviews('.card-modal');
    var cardShow = new TrelloClone.Views.CardModal({ model: card });
    this.addSubview('.card-modal', cardShow);
    this.attachSubview('.card-modal', cardShow);
    this.$('#cardModal').modal('show');
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
        view.collection.add(response);
      }
    });
  },
  saveLists: function () {
    var $lists = this.$('.board-lists').find('.list');

    $lists.each(function (idx, list) {
      var listId = $(list).data('list-id'),
          listModel = this.collection.get(listId);

      if (listModel.get('ord') === idx) { return; }

      listModel.save({ ord: idx });
    }.bind(this));

    this.resortSubviews();
  },
  resortSubviews: function () {
    this.subviews('.board-lists').sort(function (subview_a, subview_b) {
      return subview_a.model.get('ord') - subview_b.model.get('ord');
    });
  }
});
