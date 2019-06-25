const UNDOS = Symbol()
const REDOS = Symbol()
const ORIGINAL = Symbol()

function define(original, key, value) {
	Object.defineProperty(original, key, {enumerable: false, value})
}

function undo() {
	let undos = this[UNDOS]
	let redos = this[REDOS]
	let original = this[ORIGINAL]
	let spliceInfo = undos.pop()
	if (spliceInfo === undefined) return
	redos.unshift(spliceInfo)
	let {index, deleted, added} = spliceInfo
	original.splice(index, added.length, ...deleted)
}

function redo() {
	let undos = this[UNDOS]
	let redos = this[REDOS]
	let original = this[ORIGINAL]
	let spliceInfo = redos.shift()
	if (spliceInfo === undefined) return
	undos.push(spliceInfo)
	let {index, deleted, added} = spliceInfo
	original.splice(index, deleted.length, ...added)
}

function splice(index, deleteCount, ...added) {
	let undos = this[UNDOS]
	let redos = this[REDOS]
	// cancel any cached redos
	redos.length = 0
	// do native splice on original array (to prevent endless loop of calling self).
	let original = this[ORIGINAL]
	let deleted = original.splice(index, deleteCount, ...added)
	// record undo
	let spliceInfo = {index, deleted, added}
	undos.push(spliceInfo)
	// mimic return value of native .splice()
	return deleted
}

function push(...items) {
	// cancel any cached redos
	this[REDOS].length = 0
	this.splice(this.length, 0, ...items)
	return this.length
}

function unshift(...items) {
	// cancel any cached redos
	this[REDOS].length = 0
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
		case UNDOS:   return original[UNDOS]
		case REDOS:    return original[REDOS]
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
	var undos = []
	var redos = []
	define(original, UNDOS, undos)
	define(original, REDOS, redos)
	var proxy = new Proxy(original, {get, set})
	return proxy
}
