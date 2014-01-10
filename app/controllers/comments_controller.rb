class CommentsController < ApplicationController

	def create
		@post = Post.find(params[:post_id])
		@post.comments.create(:content => params[:comment][:content], :user_id => current_user.id)	
		redirect_to post_path(@post)	
	end

end
