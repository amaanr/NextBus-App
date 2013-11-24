class Post < ActiveRecord::Base
	belongs_to :stop
	belongs_to :post_type
	belongs_to :user

end
