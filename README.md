# press-serve
WPAPI is in Node so we need a Node server.

## Development
Better logs by default.

`npm start`

## Testing
Or really not since there are none.

```
[ip-address]/adv/api/v1/posts/324/342235
```

## Production
Edit the service and then save it to `systemd` a la [these](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service) instructions.

## Provisioning
How to set it up.

```
podman build . --tag=press-serve
podman run press-serve
```
