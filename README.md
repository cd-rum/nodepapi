# press-serve
WPAPI is in Node so we need a Node server.

## Development
Better logs by default.
`npm start`

## Testing
Or really not since there are none.
```
[ip-address]/adv/api/v1/posts/324/342235
journalctl -u press-serve.service --since today
```

## Production
Edit the service and then save it to `systemd` a la [these](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service) instructions.

## Provisioning
How to set it up.
```
apt-get update && apt upgrade
apt install fail2ban nginx
adduser [username]
usermod -aG sudo [username]
ssh-copy-id ~/.ssh/id_rsa.pub [username]@[host]
ssh [username]@[host]
sudo vim /etc/ssh/sshd_config # port 22000, disable PAM/password/root
sudo service sshd restart
sudo systemctl start fail2ban && sudo systemctl enable fail2ban
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 22000
sudo systemctl start ufw && sudo systemctl enable ufw
sudo ufw enable
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
cd /var/www
sudo git clone https://github.com/cd-rum/press-serve.git
sudo chown -R $USER:$USER /var/www/press-serve
npm install
sudo vim press-serve.service.original # add vars
sudo mv press-serve.service.original /etc/systemd/system/press-serve.service
sudo systemctl start press-serve
sudo systemctl enable press-serve
```
