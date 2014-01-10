class CreateUserLocations < ActiveRecord::Migration
  def change
    create_table :user_locations do |t|

      t.references :user
      t.string :latitude
      t.string :longitude
      t.references :stop
      t.timestamps
    end
  end
end
