#!/bin/bash

podman build . --tag npapi
podman run -n npapi -v tmp:/app/tmp npapi
