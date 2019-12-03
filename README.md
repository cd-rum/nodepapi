# press-serve
WPAPI is in Node so we need a Node server.

## Development
Better logs by default.
`npm start`

## Testing
Or really not since there are none.
`http -f POST https://nullerror.xyz/adv/api/v1/posts id=2 token=""`

## Production
Move the service to `systemd` a la [these](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service) instructions.

`sudo systemctl restart press-serve.service`
