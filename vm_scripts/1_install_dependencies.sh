apt-get update
apt-get install -y ca-certificates curl gnupg

curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs

node -v
npm -v

npm install -g typescript

apt-get install -y postgresql nginx
