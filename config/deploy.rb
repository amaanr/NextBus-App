#Add RVM's lib directory to the load path.
$:.unshift(File.expand_path('./lib', ENV['rvm_path']))

#Load RVM's capistrano plugin.    
require "rvm/capistrano"
require 'bundler/capistrano'

set :rvm_ruby_string, '2.0.0-p247'                                            #This is current version of ruby which is uses by RVM. To get version print: $ rvm list 
set :rvm_type, :root

set :application, "sameboat"
set :user, "sameboat"
set :rails_env, "production"
 
set :scm, :git
set :repository, "git@github.com:amaanr/sameboat.git"
set :branch, "master"
set :deploy_via, :remote_cache
set :use_sudo, true
 
server "137.117.37.79", :web, :app, :db, primary: true
 
set :deploy_to, "/home/#{user}/apps/#{application}"
default_run_options[:pty] = true
ssh_options[:forward_agent] = true
 
namespace :deploy do
  %w[start stop restart].each do |command|
    desc "#{command} unicorn server"
    task command, roles: :app, except: {no_release: true} do
      run "/etc/init.d/unicorn_#{application} #{command}"
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
  after "deploy:finalize_update", "deploy:symlink_config"
end