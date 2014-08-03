class Stop < ActiveRecord::Base
	has_many :plans
	has_many :posts
	has_many :user_locations
	reverse_geocoded_by :latitude, :longitude
	has_and_belongs_to_many :plans

	scope :nearby_stops, -> (latitude,longitude,distance) { near([latitude,longitude],distance, :order => "distance").limit(6) }

end
