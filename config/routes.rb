Sameboat::Application.routes.draw do

  
  get '/about' => "about#index"

  devise_for :users, :path => '', :path_names => {:sign_in => 'signin', :sign_out => 'signout'}, :controllers => { :omniauth_callbacks => "omniauth_callbacks"}
  get "home/index"
  post "/nearby_stops"=>"home#nearby_stops"
  get "/nearby_stops"=>"home#nearby_stops"
  root 'about#index'
  get "/admin" => "home#admin"

  resources :plans
  resources :users
  resources :posts do
    resources :comments
  end
end
