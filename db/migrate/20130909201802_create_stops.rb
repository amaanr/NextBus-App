class CreateStops < ActiveRecord::Migration
  def change
    create_table :stops do |t|
    	t.string :stop_id
    	t.string :stop_code
    	t.string :stop_name
    	t.string :stop_desc
    	t.decimal :latitude
    	t.decimal :longitude
    	t.string :zone_id
    	t.string :stop_url
    	t.string :location_type
    	t.string :parent_station
    	t.string :parent_boarding
    	t.timestamps
    end
  end
end