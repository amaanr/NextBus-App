class UserLocation < ActiveRecord::Base
	belongs_to :user
	belongs_to :stop

end
