# press-serve
WPAPI is in Node so we need a Node server.

## Development
Better logs by default.
`npm start`

## Testing
Or really not since there are none.
`https://nullerror.xyz/adv/api/v1/posts/2/""`

## Production
Edit the service and then save it to `systemd` a la [these](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service) instructions.

`sudo systemctl restart press-serve.service`

## Provisioning
How to make it work.
```
apt-get update && apt upgrade
apt install fail2ban nginx
adduser [username]
usermod -aG sudo [username]
ssh-copy-id ~/.ssh/id_rsa.pub [username]@[host]
ssh [username]@[host]
sudo vim /etc/ssh/sshd_config
sudo service sshd restart
sudo systemctl start fail2ban && sudo systemctl enable fail2ban
sudo ufw allow http
sudo ufw allow https
sudo ufw allow 22000
sudo systemctl start ufw && sudo systemctl enable ufw
sudo ufw enable
```