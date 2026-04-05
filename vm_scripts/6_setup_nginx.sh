rm -f /etc/nginx/sites-enabled/default
cp /home/vagrant/nginx_reverse_proxy /etc/nginx/sites-enabled/

mkdir -p /home/app/logs

systemctl enable nginx

systemctl restart nginx