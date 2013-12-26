class CommentsController < ApplicationController

	def create
		Post.find(params[:post_id]).comments.create(:content => params[:comment][:content], :user_id => current_user.id)	
		redirect_to new_post_path	
	end

end
