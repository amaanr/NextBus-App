class HomeController < ApplicationController
  def index
   # Stop.near([43.7956938500000004,-79.3368321],3, :order => "distance").limit(4)
   @latitude = request.location.latitude
   @longitude = request.location.longitude
  end

  # Default distance set to 10 km
  def nearby_stops
  	stops = Stop.near([params[:latitude],params[:longitude]],10, :order => "distance").limit(4)
  	render json: stops
  end
end
