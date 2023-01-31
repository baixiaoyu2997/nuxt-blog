---
title: web3js使用指南
category: 以太坊
tags:
- web3.js
date: 2022-03-10
vssue-title: web3js使用指南
---

## 介绍

web3.js 库是一组包含以太坊生态系统功能的模块。

- web3-eth，用于以太坊区块链和智能合约
- web3-shh
- web3-bzz
- web3-utils，为Dapp提供一些帮助函数



## API

### Web3

#### currentProvider

获取当前使用的 `provider`，该方法已经弃用，使用`window.ethereum`替代

### web3.eth.accounts

用于生成以太坊账户和签署交易

### getPastEvents

获取历史事件数据，返回数组，按照事件触发顺序排序`this.contract.getPastEvents("OptionCreated", { fromBlock: 1 })`

metamask限制最多获取5000条数据

为了解决这种问题，需要使用遍历来解决

```js
web3js.eth.getBlockNumber(function(error, result){
	var _from = result - 890000;
        var _to = _from + 5000;
	for(var i = 0; i < 180; i++){
	    mycontrack.getPastEvents('myEvent', {filter: {}, fromBlock: _from, toBlock: _to}).then((res) => {
            for(var m = 0;m <res.length;m++){
	          //拿出数据记录
	     }
        });
	_to += 5000;
	_from += 5000;
	}	
});
```

