---
layout:     post
title:      "使用Istio实现应用流量转移"
subtitle:   "本文翻译自istio官方文档"
description: "本任务将演示如何将应用流量逐渐从旧版本的服务迁移到新版本。通过Istio，可以使用一系列不同权重的规则（10%，20%，··· 100%）将流量平缓地从旧版本服务迁移到新版本服务。"
excerpt: "本任务将演示如何将应用流量逐渐从旧版本的服务迁移到新版本。通过Istio，可以使用一系列不同权重的规则（10%，20%，··· 100%）将流量平缓地从旧版本服务迁移到新版本服务。"
date:     2017-11-07
author:     "赵化冰"
image: "/img/istio-traffic-shifting/crossroads.png"
categories: [ "Tech"]
tags:
    - Istio
URL: "/2017/11/07/istio-traffic-shifting/"
---


关于Istio的更多内容请参考[istio中文文档](http://istio.doczh.cn/)。

原文参见[Traffic Shifting](https://istio.io/docs/tasks/traffic-management/traffic-shifting.html)。

本任务将演示如何将应用流量逐渐从旧版本的服务迁移到新版本。通过Istio，可以使用一系列不同权重的规则（10%，20%，··· 100%）将流量平缓地从旧版本服务迁移到新版本服务。
<!--more-->
为简单起见，本任务将采用两步将流量从`reviews:v1` 迁移到 `reviews:v3`，权重分别为50%，100%。


# 开始之前

* 参照文档[安装指南](http://istio.doczh.cn/docs/setup/kubernetes/index.html)中的步骤安装Istio。

* 部署[BookInfo](http://istio.doczh.cn/docs/guides/bookinfo.html) 示例应用程序。

>  请注意：本文档假设示采用kubernetes部署示例应用程序。所有的示例命令行都采用规则yaml文件（例如`samples/bookinfo/kube/route-rule-all-v1.yaml`）指定的kubernetes版本。如果在不同的环境下运行本任务，请将`kube`修改为运行环境中相应的目录（例如，对基于Consul的运行环境，目录就是`samples/bookinfo/consul/route-rule-all-v1.yaml`）。


# 基于权重的版本路由

1. 将所有微服务的缺省版本设置为v1.

   ```bash
   istioctl create -f samples/bookinfo/kube/route-rule-all-v1.yaml
   ```

1. 在浏览器中打开http://$GATEWAY_URL/productpage,  确认`reviews` 服务目前的活动版本是v1。

   可以看到浏览器中出现BooInfo应用的productpage页面。
   注意`productpage`显示的评价内容不带星级。这是由于`reviews:v1`不会访问`ratings`服务。

   > 请注意：如果之前执行过 [配置请求路由](http://istio.doczh.cn/docs/tasks/traffic-management/request-routing.html)任务，则需要先注销测试用户“jason”或者删除之前单独为该用户创建的测试规则：

     ```bash
     istioctl delete routerule reviews-test-v2
     ```

1. 首先，使用下面的命令把50%的流量从`reviews:v1`转移到`reviews:v3`:
