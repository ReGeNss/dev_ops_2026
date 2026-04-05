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

sudo usermod -s /usr/sbin/nologin vagrant
sudo usermod -L vagrant
sudo passwd -l vagrant
echo "DenyUsers vagrant" | sudo tee -a /etc/ssh/sshd_config
sudo systemctl restart ssh

cat <<'EOF' | sudo tee /etc/sudoers.d/operator
operator ALL=(ALL) NOPASSWD: /usr/bin/systemctl start task_tracker.service
operator ALL=(ALL) NOPASSWD: /usr/bin/systemctl stop task_tracker.service
operator ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart task_tracker.service
operator ALL=(ALL) NOPASSWD: /usr/bin/systemctl status task_tracker.service
operator ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload nginx.service
EOF

sudo chmod 440 /etc/sudoers.d/operator