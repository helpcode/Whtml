#!/bin/bash

# 自动提交代码到 github，linux 系统才能使用
message="shell的自动提交，更新记录查看CHANGES.md"
git add -A && git commit -m $message && git push