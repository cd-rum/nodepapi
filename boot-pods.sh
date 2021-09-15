#!/bin/bash

podman build . --tag npapi
podman run --nane npapi -v tmp:/app/tmp npapi
