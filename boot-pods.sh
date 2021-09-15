#!/bin/bash

podman build . --tag npapi
podman run --name npapi --detach -v tmp:/app/tmp npapi
