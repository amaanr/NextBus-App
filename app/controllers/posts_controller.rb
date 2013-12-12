class PostsController < ApplicationController

	def new
		@posts = Post.all
		@post = Post.new
	end

	def create
		current_user.posts.create(post_params)
		redirect_to new_post_path
	end

	def show
		
		@details = Post.find(params[:id])
		redirect_to new_post_path
	end

	private

	def post_params
		params.require(:post).permit(:content)
	end

end
