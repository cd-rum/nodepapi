#!/bin/bash

podman build . --tag npapi
podman run -v tmp:/app/tmp npapi
