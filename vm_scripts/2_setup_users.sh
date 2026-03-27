sudo useradd -m student
sudo useradd -m teacher
sudo useradd -m -g operator operator
sudo useradd -m app

echo "student:student" | sudo chpasswd
echo "teacher:12345678" | sudo chpasswd
echo "operator:12345678" | sudo chpasswd
echo "app:app" | sudo chpasswd

sudo chage -d 0 teacher
sudo chage -d 0 operator

sudo usermod -aG sudo student
sudo usermod -aG sudo teacher

sudo usermod -s /usr/sbin/nologin "$(whoami)"

sudo usermod -L "$(whoami)"