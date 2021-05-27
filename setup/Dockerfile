FROM mongo

WORKDIR /usr/src/configs

COPY config-repl.js .
COPY shard-repl.js .
COPY mongos.js .

COPY config-setup.sh .
COPY shard-setup.sh .
COPY mongos-setup.sh .

ENTRYPOINT [ "/bin/bash" ]

CMD ["./config-setup.sh", "./shard-setup.sh", "mongos-setup.sh"]