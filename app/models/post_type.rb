class PostType < ActiveRecord::Base

	has_many :posts

	def name
		return self.type_of_post
	end

end
