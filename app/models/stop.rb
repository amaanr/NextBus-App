class Stop < ActiveRecord::Base
	has_many :posts
	reverse_geocoded_by :latitude, :longitude
end
