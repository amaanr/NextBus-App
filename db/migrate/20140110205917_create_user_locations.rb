class CreateUserLocations < ActiveRecord::Migration
  def change
    create_table :user_locations do |t|

      t.references :user
      t.string :latitude
      t.string :longitude
      t.string :address
      t.string :city
      t.string :main_intersection
      t.string :neighborhood
      t.references :stop
      t.timestamps
    end
  end
end
