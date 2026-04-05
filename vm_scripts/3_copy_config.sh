rm -rf /home/app/node_modules /home/app/dist
rsync -a --delete --exclude=node_modules --exclude=dist /home/vagrant/ /home/app/

mkdir -p /etc/mywebapp
cp /home/vagrant/config.yaml /etc/mywebapp/config.yaml