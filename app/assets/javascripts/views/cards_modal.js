TrelloClone.Views.CardModal = Backbone.CompositeView.extend({
  className: 'modal fade',
  id: 'cardModal',
  template: JST['cards/modal'],
  render: function () {
    var newCard = new TrelloClone.Models.Card();
    var renderedContent = this.template({ card: this.model });
    this.$el.html(renderedContent);
    return this;
  },
  initialize: function () {
    this.showTitle = PubSub.subscribe('showTitle', this.showTitle.bind(this));
  },
  events: {
    'submit .card-detail-form': 'saveCard',
    'click .delete-card': 'deleteCard',
    'click .card-title h3': 'editTitle'
  },
  saveCard: function (event) {
    event.preventDefault();
    var params = $(event.currentTarget).serializeJSON();
    this.model.save(params['card'], {
      success: function (response) {
        $('#cardModal').modal('hide');
      }
    });
  },
  deleteCard: function () {
    PubSub.publish('destroyCard', this.model);
    $('#cardModal').modal('hide');
  },
  editTitle: function () {
    var titleEdit = new TrelloClone.Views.TitleEdit({ model: this.model });
    this.$('.card-title').empty();
    this.addSubview('.card-title', titleEdit);
  },
  showTitle: function () {
    this.$('.card-title').html('<h3>' + this.model.escape('title') + '</h3>');
  }
});
