json.(@board, :title, :user_id, :created_at, :updated_at)

json.lists @board.lists do |list|
  json.id list.id
  json.title list.title
  json.board_id list.id
  json.ord list.ord
  json.created_at list.created_at
  json.updated_at list.updated_at
  json.cards list.cards, :id, :title, :list_id, :description, :ord, :created_at, :updated_at
end
