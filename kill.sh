#!/bin/bash

# Check if at least one port is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 port1 port2 ... portN"
    exit 1
fi

# Iterate through each provided port
for port in "$@"; do
    echo "Killing processes on port: $port"
    # Use lsof to find PIDs and kill them
    lsof -t -i:$port | xargs kill -9
done

echo "Done."
