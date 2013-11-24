class CreatePostTypes < ActiveRecord::Migration
  def change
    create_table :post_types do |t|
    	t.string :type
		t.timestamps
    end
  end
end
