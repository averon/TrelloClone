TrelloClone.Views.CardNew = Backbone.View.extend({
  className: 'modal fade',
  id: 'newCard',
  template: JST['cards/new'],
  render: function () {
    var newCard = new TrelloClone.Models.Card();
    var renderedContent = this.template({ list: this.model, card: newCard });
    this.$el.html(renderedContent);
    return this;
  },
  events: {
    'submit .new-card-form': 'createCard'
  },
  createCard: function (event) {
    var view, params, cards, newCard;
    event.preventDefault();

    params = $(event.currentTarget).serializeJSON();
    cards = this.model.cards();
    
    newCard = new TrelloClone.Models.Card(params['card']);
    newCard.save({}, {
      success: function () {
        cards.add(newCard);
        $('#newCard').modal('hide');
      }
    });
  }
});