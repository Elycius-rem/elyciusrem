#!/bin/sh
cd "$(dirname "$0")"
URL="http://localhost:8080"

if command -v python3 >/dev/null 2>&1; then
  PYTHON=python3
elif command -v python >/dev/null 2>&1; then
  PYTHON=python
else
  echo "Python was not found. Install Python or run another local web server in this folder."
  exit 1
fi

(
  sleep 1
  if command -v open >/dev/null 2>&1; then
    open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL"
  fi
) &

"$PYTHON" -m http.server 8080 --bind 127.0.0.1
