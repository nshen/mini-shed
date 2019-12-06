# @shed/platform

以微信小游戏为基准，统一各小游戏平台提供的`API` ，并 `Promise` 化，各个小游戏平台均实现了 `IPlatform` 接口

## 代码示例

```typescript
let api:IPlatform = Platform.get();
api.xxx();
```
如果在微信平台，上边的代码相当于

```typescript
wx.xxx();
```


## 环境判断

```typescript
let platform = Platform.get();

if(platform.isWX){ 
    console.log('是微信平台'); 
}

if(platform.isH5){
    console.log('是Web平台');
}
```
