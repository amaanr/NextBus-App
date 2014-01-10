class Stop < ActiveRecord::Base
	has_many :posts
	has_many :user_locations
	reverse_geocoded_by :latitude, :longitude
end
