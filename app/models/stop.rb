class Stop < ActiveRecord::Base
	has_many :plans
	has_many :posts
	has_many :user_locations
	reverse_geocoded_by :latitude, :longitude
	has_and_belongs_to_many :plans
end
