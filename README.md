# undo-redo-proxy

[![Build Status](https://travis-ci.org/MikeKovarik/undo-redo-proxy.svg)](https://travis-ci.org/MikeKovarik/undo-redo-proxy)
[![NPM Version](https://img.shields.io/npm/v/undo-redo-proxy.svg?style=flat)](https://npmjs.org/package/undo-redo-proxy)
[![License](http://img.shields.io/npm/l/undo-redo-proxy.svg?style=flat)](LICENSE)
[![Dependency Status](https://david-dm.org/MikeKovarik/undo-redo-proxy.svg)](https://david-dm.org/MikeKovarik/undo-redo-proxy)
[![devDependency Status](https://david-dm.org/MikeKovarik/undo-redo-proxy/dev-status.svg)](https://david-dm.org/MikeKovarik/undo-redo-proxy#info=devDependencies)

⏳ Effortless timetravel - undo/redo proxy wrapper for arrays

## Installation

```
npm install undo-redo-proxy
```

## Usage

```js
import trackHistory from 'undo-redo-proxy'
let array = ['my', 'array']
// wraps your array, returns proxy which behaves like a normal array
array = trackHistory(array)
console.log(array) // ['my', 'array']
array.push('foo')  // ['my', 'array', 'foo']
array[2] = 'bar'   // ['my', 'array', 'bar']
array.undo()       // ['my', 'array', 'foo']
array.undo()       // ['my', 'array']
array.shift()      // ['array']
array.redo()       // ['my', 'array']
```

Can be used in browser as well

```js
import trackHistory from './node_modules/undo-redo-proxy/index.mjs'
let users = trackHistory([])
```

Only keeps track of the array and its items and positions.

```js
users.push({name: 'Mike'})
users.push({name: 'Lucy'})
users.shift()
console.log(users) // [{name: 'Lucy'}]
users.undo()
console.log(users) // [{name: 'Mike'}, {name: 'Lucy'}]
```

Does not track content of array items.

```js
users.push({name: 'Mike'}) // can be undone
users[0].name = 'Lucy' // cannot be undone
console.log(users) // [{name: 'Lucy'}]
users.undo()
console.log(users) // [{name: 'Lucy'}]
```

## Licence

MIT, Mike Kovařík, Mutiny.cz