#!/bin/bash

podman build . --tag npapi
podman run --name npapi --detach -p 3333:3333 -v tmp:/app/tmp npapi
