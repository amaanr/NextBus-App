class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new
    if user.role == "admin"
        can :admin, User
    else
        #nothing 
    end

  end

end
