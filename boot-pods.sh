#!/bin/bash

podman build . --tag=npapi
podman run -v tmp:/app/tmp -p 3333:3000 npapi
podman run -v ssl:/etc/ssl -v nginx/nginx.conf:/etc/nginx/sites-enabled/npapi.conf -p 80:80 -p 443:443 nginx
