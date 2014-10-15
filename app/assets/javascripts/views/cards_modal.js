TrelloClone.Views.CardModal = Backbone.View.extend({
  className: 'modal fade',
  id: 'cardModal',
  template: JST['cards/modal'],
  render: function () {
    var newCard = new TrelloClone.Models.Card();
    var renderedContent = this.template({ card: this.model });
    this.$el.html(renderedContent);
    return this;
  },
  events: {
    'submit .card-detail-form': 'saveCard'
  },
  saveCard: function (event) {
    event.preventDefault();
    var params = $(event.currentTarget).serializeJSON();
    this.model.save(params['card'], {
      success: function (response) {
        $('#cardModal').modal('hide');
      }
    });
  }
});
