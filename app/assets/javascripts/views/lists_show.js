TrelloClone.Views.ListShow = Backbone.View.extend({
  className: 'list',
  template: JST['lists/show'],
  render: function () {
    var renderedContent, cards, $listCards, $cardCreate;
    renderedContent = this.template({ list: this.model });
    this.$el.html(renderedContent);
    this.$el.attr('id', this.model.id);
    
    // TODO: render less!
    $listCards = this.$('.cards');
    
    cards = this.model.cards();
    cards.each(function (card) {
      var cardShow = new TrelloClone.Views.CardShow({ model: card });
      renderedContent = cardShow.render().$el
      $listCards.append(renderedContent);
    });
    
    $createCard = $('<button>Add new card...</button>');
    $createCard.attr({
      'class': 'create card',
      'data-toggle': 'modal',
      'data-target': '#createCard-' + this.model.id
    });
    $listCards.append($createCard);
    
    return this;
  },
  initialize: function () {
    this.listenTo(this.model.cards(), 'add remove', this.render);
  },
  events: {
    'submit .new-card-form': 'createCard',
    'click .destroy-card': 'destroyCard',
    // TODO: persist ord after drop
    // 'sortstop .cards': 'updateOrd'
  },
  createCard: function (event) {
    var params, cards, newCard;
    event.preventDefault();
    
    params = $(event.currentTarget).serializeJSON();
    params['card']['list_id'] = this.model.id;
    
    cards = this.model.cards();
    
    newCard = new TrelloClone.Models.Card(params['card']);
    newCard.save({}, {
      success: function () {
        cards.add(newCard);
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
      }
    });
  },
  destroyCard: function (event) {
    var id, card;
    id = event.currentTarget.id;
    card = this.model.cards().get(id);
    card.destroy();
  },
  updateOrd: function (event) {
    var $list;
    $list = $(event.currentTarget).find('li');
    $list.each(function (li) {
      li.id
    });
  }
});