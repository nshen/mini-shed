#!/bin/bash

set -e # 失败直接退出

INPUT_SSH_PRIVATE_KEY=$1
INPUT_TARGET_REPO=$2
INPUT_TARGET_BRANCH=$3
INPUT_SOURCE_FOLDER=$4

echo $INPUT_SSH_PRIVATE_KEY
echo $INPUT_TARGET_REPO
echo $INPUT_TARGET_BRANCH
echo $INPUT_SOURCE_FOLDER

if [[ -n "$INPUT_SSH_PRIVATE_KEY" ]]
then
  mkdir -p /root/.ssh
  echo "$INPUT_SSH_PRIVATE_KEY" > /root/.ssh/id_rsa
  chmod 600 /root/.ssh/id_rsa
fi

mkdir -p ~/.ssh
cp /root/.ssh/* ~/.ssh/ 2> /dev/null || true 

# ssh -T git@gitee.com

# sh -c "/git-pub.sh $*"

cd $GITHUB_WORKSPACE
cd $INPUT_SOURCE_FOLDER
git config --global user.email "nshen121@gmail.com"
git config --global user.name "mini-shed"
git init
git remote add origin $INPUT_TARGET_REPO
git add .
git commit -am 'update'
git push origin $INPUT_TARGET_BRANCH -f

