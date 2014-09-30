class AboutController < ApplicationController
  before_filter :redirect_to_home_index, only: [:index]
  layout false
  
  def index
  end
  private
  def redirect_to_home_index
    redirect_to home_index_path if user_signed_in?
  end
end
