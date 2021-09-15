#!/bin/bash

podman build . --tag=npapi
podman run -v tmp:/app/tmp -p 3333:3333 npapi
podman run -v ssl:/etc/ssl -v nginx:/etc/nginx/sites-enabled -p 80:80 -p 443:443 nginx
