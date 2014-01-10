class PostsController < ApplicationController

	def index
		@posts = Post.order("updated_at DESC")
		@new_post = Post.new
	end

	def create
		current_user.posts.create(post_params)
		redirect_to posts_path
	end

	def show
		@posts = Post.order("updated_at DESC")
		@new_post = Post.new
		@post = Post.find(params[:id])
		@comment = Comment.new
		render 'posts/index'
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
