class CreatePlans < ActiveRecord::Migration
  def change
    create_table :plans do |t|

      t.timestamps
      t.string :start_address
      t.string :end_address
      t.string :current_location
      t.integer :nearest_stop_id
      t.integer :start_stop_id
      t.integer :end_stop_id
      t.integer :total_distance
      t.integer :total_time
      t.integer :speed
    end
  end
end
