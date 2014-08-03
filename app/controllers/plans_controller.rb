class PlansController < ApplicationController
	before_action :authenticate_user!
	def index

	end

	def create
		plan = Plan.new(plan_params)
		stops = Stop.near([params[:latitude],params[:longitude]],10, :order => "distance").limit(4)
		plan.nearest_stops << stops
		plan.start_stop = Stop.near(params[:plan][:start_address],10, :order => "distance").limit(1)[0]
		plan.end_stop = Stop.near(params[:plan][:end_address],10, :order => "distance").limit(1)[0]
		plan.save


		render nothing: true
	end
	private

	def plan_params
		params.require(:plan).permit(:total_distance, :total_time, :start_address, :end_address, :speed)
	end
end
