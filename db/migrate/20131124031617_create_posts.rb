class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
    	t.string :content
    	t.integer :user_id
    	t.integer :stop_id
    	t.integer :post_type_id
		t.timestamps
    end
  end
end
