# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
require 'csv'
# require 'debugger'
CSV.foreach("db/stops.csv") do |row|
	Stop.new(
		stop_id: row[0],
		stop_code: row[1],
		stop_name: row[2],
		stop_desc: row[3],
		latitude: row[4],
		longitude: row[5],
		zone_id: row[6],
		stop_url: row[7],
		location_type: row[8],
		parent_station: row[9],
		parent_boarding: row[10]

	).save
end

["Accident","Delay","Damage","Poetry"].each do |post_type|
	PostType.new(:type_of_post => post_type).save
end