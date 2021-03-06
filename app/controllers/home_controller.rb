class HomeController < ApplicationController
  before_filter :authenticate_user!, :only => [:admin]
  
  def require_login
    unless user_signed_in?
      flash[:error] = "You must be logged in to access this section"
      redirect_to about_index # halts request cycle
    end
  end
  
  def index
   # Stop.near([43.7956938500000004,-79.3368321],3, :order => "distance").limit(4)
   #@latitude = request.location.latitude
   #@longitude = request.location.longitude
  end

  def admin
    @users_count = UserLocation.count
    @users_today = UserLocation.where("created_at >= ?", Time.zone.now.beginning_of_day).count
    @users = UserLocation.all
    authorize! :admin, User
  end

  # Default distance set to 10 km, nearest 4 stops
  def nearby_stops
  	stops = Stop.near([params[:latitude],params[:longitude]],10, :order => "distance").limit(6)
    google_results = UserLocation.search(params[:latitude],params[:longitude])
    geocoder_ca_results = UserLocation.geocoder_ca(params[:latitude],params[:longitude]).intersection
    user_location=UserLocation.new(
      :user_id => current_user.id,
      :longitude => params[:longitude],
      :latitude => params[:latitude],
      :address => google_results.address,
      :city => google_results.city,
      :neighborhood => google_results.neighborhood,
      :main_intersection => "#{geocoder_ca_results["street1"]} & #{geocoder_ca_results["street2"]}"
      )
    user_location.save
    if stops.empty?
      render json: stops, status: 422
    else
  	 render json: stops
    end
  end
end
