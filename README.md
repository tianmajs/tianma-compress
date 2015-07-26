# tianma-compress

![build status](https://travis-ci.org/tianmajs/tianma-compress.svg?branch=master)

提供HTTP压缩功能。

## 安装

    $ npm install tianma-compress

## 使用

默认配置下，对js、css和html启用压缩。

    var tianma = require('tianma');

    tianma(8080)
        .compress()
        .use(middleware);

可自定义需要压缩的文件类型。
    var tianma = require('tianma');

    tianma(8080)
        .compress('js', 'css', 'svg')
        .use(middleware);

自定义需要压缩的文件类型时也支持数组形式的参数。

    var tianma = require('tianma');

    tianma(8080)
        .compress([ 'js', 'css', 'svg' ])
        .use(middleware);

## 授权协议

[MIT](https://github.com/tianmajs/tianmajs.github.io/blob/master/LICENSE)
