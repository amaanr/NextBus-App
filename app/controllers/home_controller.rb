class HomeController < ApplicationController
  def index
   # Stop.near([43.7956938500000004,-79.3368321],3, :order => "distance").limit(4)
   @latitude = request.location.latitude
   @longitude = request.location.longitude
  end

	def current
	@latitude = request.location.latitude
	@longitude = request.location.longitude
	end

end
