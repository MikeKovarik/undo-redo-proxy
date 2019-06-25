# undoredo

[![Build Status](https://travis-ci.org/MikeKovarik/undoredo.svg)](https://travis-ci.org/MikeKovarik/undoredo)
[![NPM Version](https://img.shields.io/npm/v/undoredo.svg?style=flat)](https://npmjs.org/package/undoredo)
[![License](http://img.shields.io/npm/l/undoredo.svg?style=flat)](LICENSE)
[![Dependency Status](https://david-dm.org/MikeKovarik/undoredo.svg)](https://david-dm.org/MikeKovarik/undoredo)
[![devDependency Status](https://david-dm.org/MikeKovarik/undoredo/dev-status.svg)](https://david-dm.org/MikeKovarik/undoredo#info=devDependencies)

⏳ Effortless timetravel - undo/redo proxy wrapper for arrays

## Installation

```
npm install undoredo
```

## Usage

```js
import trackHistory from 'undoredo'
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
import trackHistory from './node_modules/undoredo/index.mjs'
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