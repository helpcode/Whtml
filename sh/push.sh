#!/bin/bash
message="脚本的自动提交，版本更新查看CHANGES.md"

git add -A && git commit -m $message && git push