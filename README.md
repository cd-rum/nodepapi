# press-serve
WPAPI is in Node so we need a Node server.

## Development
Better logs by default.

`npm start`

## Testing
Or really not since there are none.

`http://0.0.0.0:3000/adv/api/v1/posts/2143/a-token`

## Production
Move the service to `systemd` a la [these](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service) instructions.

`sudo systemctl restart press-serve.service`
