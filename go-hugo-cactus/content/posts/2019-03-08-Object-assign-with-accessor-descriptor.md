---
title: Object.assign() with accessor descriptor
date: 2019-03-08 09:00:00
tags:
    - JavaScript
category: tech
keywords:
    - Javascript
    - ES2015
    - ES6
---

[MDN docs:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Copying_accessors)
>The Object.assign() method only copies enumerable and own properties from a source object to a target object. It uses [[Get]] on the source and [[Set]] on the target, so it will invoke getters and setters. Therefore it assigns properties versus just copying or defining new properties. This may make it unsuitable for merging new properties into a prototype if the merge sources contain getters.

For example

```js
class Cat {
    constructor(name) {
        this._name = name;
    }

    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
}

let nyannko = new Cat("nyannko");
let copy = Object.assign({}, nyannko)

console.log(nyannko.name) // nyannko
console.log(copy.name) // undefined
```

The `name` property is lost. 

<!--more-->

To copy accessors, we can use `Object.getOwnPropertyDescriptor()` and `Object.defineProperty()` as the MDN docs recommend:

```js
var obj = {
  foo: 1,
  get bar() {
    return 2;
  }
};
