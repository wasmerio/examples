---
title: uipath ノート（三）- uipath orchestrator
date: 2019-11-23 09:00:00
tags:
    - RPA
categories:
- notes
keywords:
    - RPA
    - uipath
---


## 利用手順

Official doc: [https://docs.uipath.com/robot/docs/from-orchestrator-and-the-orchestrator-settings-window](https://docs.uipath.com/robot/docs/from-orchestrator-and-the-orchestrator-settings-window)

### マシンを追加

マシン側でマシン名とユーザ名を確認

```
C:\Users\user>hostname
DESKTOP-ABCDE5F

C:\Users\user>whoami
desktop-abcde5f\user

C:\Users\user>
```

追加完了後、マシンキーを取得する。

### ロボットを登録

* Type: studio (開発用？)
* Domain/Username: 上記のユーザ名

### ローカルのorchestrator設定

Uipath Robotを開き⇒orchestratorの設定で、上記のマシンキーを入力する。
orchestrator URLに `https://platform.uipath.com/` を入力する.
`Invalid machine key`というエラーが出たら、下記のようなURLを試す：
```
https://platform.uipath.com/<account name>/<service name>
```

参照：[Uipath orchestrator error : invalid machine key](https://forum.uipath.com/t/uipath-orchestrator-error-invalid-machine-key/153438/16)

### ロボットグループ(Environment)作成

