# npapi
WPAPI is in Node so we need a Node server.

## Development
Better logs by default.

`npm start`

## Testing
Or really not since there are none.

```
/api/v1/posts/324/342235
```

## Provisioning
```
adduser npapi
usermod -aG sudo npapi
exit

ssh-copy-id -i ~/.ssh/id_rsa.pub npapi@[host]
ssh npapi@[host]
sudo vim /etc/ssh/sshd_config
sudo service sshd restart

. /etc/os-release
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_${VERSION_ID}/ /" | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
curl -L "https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/xUbuntu_${VERSION_ID}/Release.key" | sudo apt-key add -
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get -y install podman
```

## Booting
```
./boot-pods.sh
```
