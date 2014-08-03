class UserLocation < ActiveRecord::Base
	belongs_to :user
	belongs_to :stop

	def self.search(latitude,longitude)
		Geocoder.configure(:lookup => :google)
		results = Geocoder.search("#{latitude},#{longitude}")
		result = results.select {|res| !res.neighborhood.nil? && !res.address.nil? }.first
		if result.nil?
			return results.first
		else
			return result
		end
	end

	def self.geocoder_ca(latitude,longitude)
		Geocoder.configure(:lookup => :geocoder_ca)
		result=Geocoder.search("#{latitude},#{longitude}").first
		return result
	end


end
