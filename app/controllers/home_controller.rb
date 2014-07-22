class HomeController < ApplicationController
  # before_filter :authenticate_user!, :only => [:index]
  def index
   # Stop.near([43.7956938500000004,-79.3368321],3, :order => "distance").limit(4)
   @latitude = request.location.latitude
   @longitude = request.location.longitude
  end

  # Default distance set to 10 km, nearest 4 stops
  def nearby_stops
  	stops = Stop.near([params[:latitude],params[:longitude]],10, :order => "distance").limit(4)
    res = UserLocation.search(params[:latitude],params[:longitude])
    res2 = UserLocation.geocoder_ca(params[:latitude],params[:longitude]).intersection
    u=UserLocation.new(
      :longitude => params[:longitude],
      :latitude => params[:latitude],
      :address => res.address,
      :city => res.city,
      :neighborhood => res.neighborhood,
      :main_intersection => "#{res2["street1"]} & #{res2["street2"]}"
      )
    u.save
  	render json: stops
  end
end
