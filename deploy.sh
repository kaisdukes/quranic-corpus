#!/bin/bash

npm run build
scp -i ../../dev/keys/fasthosts -r build/* admin-user@hunna.app:/var/www/qurancorpus.app/html