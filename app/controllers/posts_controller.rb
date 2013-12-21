class PostsController < ApplicationController

	def new
		@posts = Post.order("updated_at DESC")
		@post = Post.new
	end

	def create
		current_user.posts.create(post_params)
		redirect_to new_post_path
	end

	def show
		@post = Post.find(params[:id])
		@comment = Comment.new
	end

	def destroy
		@post = Post.find(params[:id])
    @post.destroy
	end

	private

	def post_params
		params.require(:post).permit(:content, :post_type_id)
	end

end
