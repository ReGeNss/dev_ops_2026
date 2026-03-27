cp /home/app/system_md/task_tracker.service /etc/systemd/system/task_tracker.service
chmod +x /home/app/system_md/task_tracker_service.sh

sudo systemctl daemon-reload
sudo systemctl enable task_tracker.service
sudo systemctl start task_tracker.service