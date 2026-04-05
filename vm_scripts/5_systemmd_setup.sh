cp /home/app/system_md/task_tracker.service /etc/systemd/system/task_tracker.service
cp /home/app/system_md/task_tracker.socket /etc/systemd/system/task_tracker.socket

chmod +x /home/app/system_md/task_tracker_service.sh

(cd /home/app && npm run setup)

sudo systemctl daemon-reload
systemctl enable task_tracker.socket
sudo systemctl start task_tracker.socket
