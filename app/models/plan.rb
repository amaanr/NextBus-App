class Plan < ActiveRecord::Base
	has_and_belongs_to_many :nearest_stops, :class_name => "Stop"
	belongs_to :start_stop, :class_name => "Stop"
	belongs_to :end_stop, :class_name => "Stop"


end
