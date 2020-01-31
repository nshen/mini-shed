## 触发

每次`push`源代码到 `github` 时，会触发此流程

## 发布 starter 

`github actions`会自动把 `/packages/starter` 目录 ，强`push`到 `coding.net` 和 `gitee.com` 以下项目地址


- https://shed.coding.net/p/mini-shed-starter
- https://gitee.com/nshen/mini-shed-starter

使用`@shed/cli`命令行创建游戏时，实际上是从上边的地址clone下来的

```bash
shed create myGame 
# 实际是从 https://e.coding.net/shed/mini-shed-starter.git 克隆
```
- git@gitee.com:nshen/mini-shed-starter.git
- git@e.coding.net:shed/mini-shed-starter.git
