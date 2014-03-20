class CreatePlansStopsJoinTable < ActiveRecord::Migration
  def change
  	create_join_table :plans, :stops
  end
end
