#!/bin/bash

podman build . --tag npapi
podman run --nane npapi -d -v tmp:/app/tmp npapi
