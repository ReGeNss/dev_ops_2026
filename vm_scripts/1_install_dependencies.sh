apt-get update

curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs

node -v
npm -v

npm install -g typescript

apt-get install -y postgresql nginx

wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
chmod +x /usr/local/bin/yq
