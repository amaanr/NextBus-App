class ChangePostTypeTypeToTypeOfPost < ActiveRecord::Migration
  def change
  	rename_column :post_types, :type, :type_of_post
  end
end
