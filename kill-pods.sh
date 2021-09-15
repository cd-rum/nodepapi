#!/bin/bash

podman stop -a
podman rmi $(podman images -qa) -f

