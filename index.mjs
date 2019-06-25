const HISTORY = Symbol()
const FUTURE = Symbol()
const SPLICE = Symbol()
const ORIGINAL = Symbol()

function define(original, key, value) {
	Object.defineProperty(original, key, {enumerable: false, value})
}

function undo() {
	let history = this[HISTORY]
	let future = this[FUTURE]
	let original = this[ORIGINAL]
	let spliceInfo = history.pop()
	if (spliceInfo === undefined) return
	future.unshift(spliceInfo)
	let {index, deleted, added} = spliceInfo
	original.splice(index, added.length, ...deleted)
}

function redo() {
	let history = this[HISTORY]
	let future = this[FUTURE]
	let original = this[ORIGINAL]
	let spliceInfo = future.shift()
	if (spliceInfo === undefined) return
	history.push(spliceInfo)
	let {index, deleted, added} = spliceInfo
	original.splice(index, deleted.length, ...added)
}

function splice(index, deleteCount, ...added) {
	let history = this[HISTORY]
	let future = this[FUTURE]
	future.length = 0
	let original = this[ORIGINAL]
	let deleted = original.splice(index, deleteCount, ...added)
	let spliceInfo = {index, deleted, added}
	history.push(spliceInfo)
	return deleted
}

function push(...items) {
	// cancel any cached redos
	this[FUTURE].length = 0
	this.splice(this.length, 0, ...items)
	return this.length
}

function unshift(...items) {
	// cancel any cached redos
	this[FUTURE].length = 0
	this.splice(0, 0, ...items)
	return this.length
}

function pop() {
	if (this.length === 0) return undefined
	return this.splice(this.length - 1, 1)[0]
}

function shift() {
	if (this.length === 0) return undefined
	return this.splice(0, 1)[0]
}

function get(original, key) {
	switch(key) {
		case 'undo':    return undo
		case 'redo':    return redo
		case 'splice':  return splice
		case 'push':    return push
		case 'pop':     return pop
		case 'shift':   return shift
		case 'unshift': return unshift
		case SPLICE:    return Array.prototype.splice
		case HISTORY:   return original[HISTORY]
		case FUTURE:    return original[FUTURE]
		case ORIGINAL:  return original
	}
	return original[key]
}

function set(original, key, value, proxy) {
	if (Number.isFinite(Number(key))) {
		key = Number(key)
		//this.splice(key, 1, value)
		if (key >= original.length) {
			let empty = new Array(key - original.length)
			proxy.splice(key, 1, ...empty, value)
		} else {
			proxy.splice(key, 1, value)
		}
		//splice.call(this, key, 1, value)
		//splice.call(original, key, 1, value)
		//original.splice(key, 1, value)
	} else {
		original[key] = value
	}
	return true
}

export default function(original) {
	var history = []
	var future = []
	define(original, HISTORY, history)
	define(original, FUTURE, future)
	var proxy = new Proxy(original, {get, set})
	return proxy
}
