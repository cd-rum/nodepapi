#!/bin/bash

podman build . --tag npapi
podman run -v tmp:/app/tmp npapi
podman run -v ssl:/etc/ssl ---mount type=bind,source=nginx,target=/etc/nginx -p 80:80 -p 443:443 nginx
