今天遇到了一个git分支误删除的问题，记录下找回过程
如果远端和本地分支都被删除了，可以执行一下命令展示恢复的分支的散列值
```
git reflog
```
再恢复分支
```
git branch <branch_name> <hash_val>
```