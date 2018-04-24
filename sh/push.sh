#!/bin/bash

# 自动提交代码到 github，linux 系统才能使用
message="脚本的自动提交，版本更新查看CHANGES.md"
git add -A && git commit -m $message && git push