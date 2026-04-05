#!/bin/bash
set -euo pipefail
cd /home/app
npm install
npm run build
npm run migrate
exec npm run start
