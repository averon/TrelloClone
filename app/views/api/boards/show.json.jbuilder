json.(@board, :title, :user_id, :created_at, :updated_at)

json.lists @board.lists, :id, :title, :board_id, :ord, :created_at, :updated_at
# json.members @board.members, :email, :created_at, :updated_at

# json.lists @board.lists do |list|
#   json.id @board.id
#   json.title @board.title
#   json.board_id @board.id
#   json.cards list.cards, :title, :list_id, :description, :ord
# end