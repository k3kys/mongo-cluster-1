#!/bin/bash
sleep 20 | echo Sleeping

mongo mongodb://15.164.251.138:50001 shard-repl.js
