require "rvm/capistrano"
require "bundler/capistrano"

# Add RVM's lib directory to the load path.
# $:.unshift(File.expand_path('./lib', ENV['rvm_path']))
set :rvm_ruby_string, 'ruby-2.0.0-p247'
set :rvm_ruby_string, ENV['GEM_HOME'].gsub(/.*\//,"")

set :application, "Sameboat"
set :user, "sameboat"


set :scm, :git
set :repository, "git@github.com:amaanr/Sameboat.git"
set :branch, "master"
set :use_sudo, true


server "sameboat.cloudapp.net", :web, :app, :db, primary: true


set :deploy_to, "/home/#{user}/apps/#{application}"
default_run_options[:pty] = true
ssh_options[:forward_agent] = true
ssh_options[:port] = 22


namespace :deploy do
  desc "Fix permissions"
  task :fix_permissions, :roles => [ :app, :db, :web ] do
    run "chmod +x #{release_path}/config/unicorn_init.sh"
  end


  %w[start stop restart].each do |command|
    desc "#{command} unicorn server"
    task command, roles: :app, except: {no_release: true} do
      run "service unicorn_#{application} #{command}"
    end
  end


  task :setup_config, roles: :app do
    sudo "ln -nfs #{current_path}/config/nginx.conf /etc/nginx/sites-enabled/#{application}"
    sudo "ln -nfs #{current_path}/config/unicorn_init.sh /etc/init.d/unicorn_#{application}"
    sudo "mkdir -p #{shared_path}/config"
  end
  after "deploy:setup", "deploy:setup_config"


  task :symlink_config, roles: :app do
    # Add database config here
  end
  after "deploy:finalize_update", "deploy:fix_permissions"
  after "deploy:finalize_update", "deploy:symlink_config"
end