# npapi
WPAPI is in Node so we need a Node server.

## Development
Better logs by default.

`npm start`

## Testing
Or really not since there are none.

```
/adv/api/v1/posts/324/342235
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
```

## Booting
```
podman build . --tag=press-serve
podman run press-serve
```
