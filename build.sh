#! /usr/bin/env bash

cyan="\e[36m"
green="\e[32m"
end="\e[0m"

SERVER_DOCKERFILE=$(pwd)/Dockerfile.server
AGENT_DOCKERFILE=$(pwd)/Dockerfile.agent

nameprefix=ikosh
serverImageName=$nameprefix/server
agentImageName=$nameprefix/agent

echo -e "${green}Building source code${end}"
npm run build

echo -e "${green}Building server image${end}"
docker build -f $SERVER_DOCKERFILE -t $serverImageName .

echo -e "${green}Building agent image${end}"
docker build -f $AGENT_DOCKERFILE -t $agentImageName .

echo -e "${cyan}Images names:"
echo -e $serverImageName
echo -e $agentImageName${end}
