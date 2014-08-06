class UsersController < ApplicationController
	before_filter :authenticate_user!
	# Later use
	# def show
	# 	@user = User.find(params[:id])
	# end

	def index
		@users = User.all
	end

	def new
		@user = User.new
	end

	def create
	  @user = User.new(user_params)

  	if @user.save
  		redirect_to users_path, notice: "User created"
  	else
  		redirect_to users_path, notice: "User not created, error"
  	end
	end
	private
	def user_params
    params.require(:user).permit(:first_name,:last_name, :email, :password, :password_confirmation, :role)
  end

end
