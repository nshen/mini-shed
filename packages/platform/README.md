# @shed/platform

:hammer: 以微信小游戏为基准，统一各小游戏平台提供的`API` ，并 `Promise` 化，

各个小游戏平台均实现了 `IPlatform` 接口

当使用 `@shed/cli` 编译到某个平台时，会利用 `rollup` 的 `tree shaking` 自动将其他无关平台的代码删掉。

## 安装

```bash
npm install @shed/platform
```
或使用 `yarn`

```bash
yarn add @shed/platform
```

## 用法

```typescript
let api:IPlatform = Platform.get();
api.xxx();
```
如果在微信平台，上边的代码经过 `@shed/cli` 编译后相当于

```typescript
wx.xxx();
```

### 环境判断

```typescript
let platform = Platform.get();

if(platform.isWX){ 
    console.log('是微信平台'); 
}

if(platform.isH5){
    console.log('是Web平台');
}
```

## Contributors

* [nshen](https://github.com/nshen)

## License

[The MIT License](http://opensource.org/licenses/MIT)