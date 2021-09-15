#!/bin/bash

podman build . --tag npapi
podman run --name npapi --daemon -v tmp:/app/tmp npapi
