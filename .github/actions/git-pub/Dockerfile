# based on http://github.com/wei/git-sync
FROM alpine

LABEL "com.github.actions.name"="Git Pub"
LABEL "com.github.actions.description"="🔃 push files to another git repository"
LABEL "com.github.actions.icon"="git-commit"
LABEL "com.github.actions.color"="blue"

RUN apk add --no-cache git openssh-client bash && \
  echo "StrictHostKeyChecking no" >> /etc/ssh/ssh_config

ADD *.sh /

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]