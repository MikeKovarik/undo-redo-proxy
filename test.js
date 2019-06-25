import {assert} from 'chai'
import initHistory from './index.mjs'


describe('Array', () => {

	describe('basic functionality', () => {

		describe('.length', () => {

			it('should be 0 on empty array', () => {
				let array = initHistory([])
				assert.lengthOf(array, 0)
			})

			it('should be 3 on [0,1,2]', () => {
				let array = initHistory([0,1,2])
				assert.lengthOf(array, 3)
			})

			it('should increase with items', () => {
				let raw = [0]
				let array = initHistory(raw)
				assert.lengthOf(array, 1)
				raw[1] = 1
				assert.lengthOf(array, 2)
			})

			it('array.length = 0 should remove all items', () => {
				let array = initHistory([0,1,2])
				assert.lengthOf(array, 3)
				array.length = 0
				assert.lengthOf(array, 0)
				assert.equal(array[0], undefined)
			})

		})

		describe('[index] notation', () => {

			it('items should reflect contents of original array', () => {
				let array = initHistory(['hello', 'world', 42, true])
				assert.equal(array[0], 'hello')
				assert.equal(array[1], 'world')
				assert.equal(array[2], 42)
				assert.equal(array[3], true)
			})

			it('assigning item to start of empty array should work', () => {
				let array = initHistory([])
				assert.equal(array[0], undefined)
				array[0] = 'hai'
				assert.equal(array[0], 'hai')
			})

			it('assigning item to middle of empty array should work 1', () => {
				let array = initHistory([])
				assert.equal(array[2], undefined)
				array[2] = 'three'
				assert.equal(array[0], undefined)
				assert.equal(array[2], 'three')
				assert.lengthOf(array, 3)
			})

			it('assigning item to middle of empty array should work 2', () => {
				let array = initHistory(['one'])
				assert.equal(array[2], undefined)
				array[2] = 'three'
				assert.equal(array[0], 'one')
				assert.equal(array[1], undefined)
				assert.equal(array[2], 'three')
				assert.lengthOf(array, 3)
			})

			it('assigning item to middle of empty array should work 3', () => {
				let original = new Array(5)
				original[4] = 'five'
				let array = initHistory(original)
				assert.equal(array[2], undefined)
				array[2] = 'three'
				assert.equal(array[0], undefined)
				assert.equal(array[2], 'three')
				assert.equal(array[4], 'five')
				assert.lengthOf(array, 5)
			})

			it('replacing item should work', () => {
				let array = initHistory([0, 1, 2, 'before'])
				assert.equal(array[3], 'before')
				array[3] = 'after'
				assert.equal(array[3], 'after')
			})

			it('delete[index] should delete the item', () => {
				let array = initHistory(['one', 'two', 'three'])
				assert.equal(array[1], 'two')
				delete array[1]
				assert.equal(array[1], undefined)
				assert.lengthOf(array, 3)
			})

		})

		describe('.push()', () => {

			it('should add new items to end', () => {
				let array = initHistory([])
				array.push('one')
				array.push('two')
				assert.equal(array[0], 'one')
				assert.equal(array[1], 'two')
			})

			it('should return new length', () => {
				let array = initHistory([])
				assert.equal(array.push('one'), 1)
				assert.equal(array.push('two'), 2)
			})

		})

		describe('.unshift()', () => {

			it('should add new items to start', () => {
				let array = initHistory([])
				array.unshift('two')
				array.unshift('one')
				assert.equal(array[0], 'one')
				assert.equal(array[1], 'two')
			})

			it('should return new length', () => {
				let array = initHistory([])
				assert.equal(array.unshift('one'), 1)
				assert.equal(array.unshift('two'), 2)
			})

		})

		describe('.pop()', () => {

			it('pop on empty array returns undefined', () => {
				let array = initHistory([])
				assert.equal(array.pop(), undefined)
			})

			it('pop returns last item', () => {
				let array = initHistory(['one', 'two'])
				assert.equal(array.pop(), 'two')
			})

		})

		describe('.shift()', () => {

			it('shift on empty array returns undefined', () => {
				let array = initHistory([])
				assert.equal(array.shift(), undefined)
			})

			it('shift returns first item', () => {
				let array = initHistory(['one', 'two'])
				assert.equal(array.shift(), 'one')
			})

		})

	})

	describe('history', () => {

		describe('.undo()', () => {

			it('should do nothing on empty array', () => {
				let array = initHistory([])
				assert.lengthOf(array, 0)
				array.undo()
				assert.lengthOf(array, 0)
			})

			it('should undo replaced item', () => {
				let array = initHistory(['initial'])
				assert.equal(array[0], 'initial')
				array[0] = 'replaced'
				assert.equal(array[0], 'replaced')
				array.undo()
				assert.equal(array[0], 'initial')
			})

			it('should undo push', () => {
				let array = initHistory(['one'])
				assert.lengthOf(array, 1)
				array.push('two')
				assert.lengthOf(array, 2)
				array.undo()
				assert.lengthOf(array, 1)
			})

			it('should undo pushes', () => {
				let array = initHistory(['one'])
				array.push('two')
				array.push('three')
				assert.lengthOf(array, 3)
				array.undo()
				array.undo()
				assert.lengthOf(array, 1)
				assert.equal(array[0], 'one')
				assert.equal(array[1], undefined)
			})

			it('should undo pop', () => {
				let array = initHistory(['initial'])
				assert.lengthOf(array, 1)
				array.pop()
				assert.lengthOf(array, 0)
				array.undo()
				assert.lengthOf(array, 1)
			})

			it('should undo multiple pops (2x)', () => {
				let array = initHistory(['one', 'two'])
				array.pop()
				array.pop()
				assert.lengthOf(array, 0)
				array.undo()
				array.undo()
				assert.equal(array[0], 'one')
				assert.equal(array[1], 'two')
			})

			it('should undo multiple pops (3x)', () => {
				let array = initHistory(['one', 'two', 'three'])
				array.pop()
				array.pop()
				array.pop()
				assert.lengthOf(array, 0)
				array.undo()
				array.undo()
				array.undo()
				assert.equal(array[0], 'one')
				assert.equal(array[1], 'two')
				assert.equal(array[2], 'three')
			})

		})

		describe('.redo()', () => {

			it('should do nothing on empty array', () => {
				let array = initHistory([])
				assert.lengthOf(array, 0)
				array.redo()
				assert.lengthOf(array, 0)
			})

			it('multiple redos should not have side effects', () => {
				let array = initHistory(['initial'])
				array.unshift('new')
				array.undo()
				array.redo()
				array.redo()
				array.redo()
				assert.lengthOf(array, 2)
				assert.equal(array[0], 'new')
				assert.equal(array[1], 'initial')
			})

			it('should redo undone replacement', () => {
				let array = initHistory(['initial'])
				array[0] = 'replaced'
				array.undo()
				assert.equal(array[0], 'initial')
				array.redo()
				assert.equal(array[0], 'replaced')
			})

			it('should redo undone pop', () => {
				let array = initHistory(['initial'])
				assert.lengthOf(array, 1)
				array.pop()
				assert.lengthOf(array, 0)
				array.undo()
				assert.lengthOf(array, 1)
				array.redo()
				assert.lengthOf(array, 0)
			})

			it('unshift() cancels redo 2', () => {
				let array = initHistory(['initial'])
				assert.lengthOf(array, 1)
				array.pop()
				assert.lengthOf(array, 0)
				array.undo()
				assert.lengthOf(array, 1)
				array.unshift('new')
				assert.lengthOf(array, 2)
				array.redo()
				assert.equal(array[0], 'new')
				assert.equal(array[1], 'initial')
			})

			it('push() cancels redo', () => {
				let array = initHistory([])
				array[0] = 'should not be redone'
				assert.lengthOf(array, 1)
				array.undo()
				assert.lengthOf(array, 0)
				array.push('new')
				assert.equal(array[0], 'new')
				array.redo()
				assert.equal(array[0], 'new')
			})

			it('[index] set cancels redo', () => {
				let array = initHistory([])
				array[0] = 'should not be redone'
				assert.lengthOf(array, 1)
				array.undo()
				assert.lengthOf(array, 0)
				array[0] = 'new'
				assert.equal(array[0], 'new')
				array.redo()
				assert.equal(array[0], 'new')
			})

		})

		describe('complex tests', () => {

			it('#1', () => {
				let array = initHistory([])
				assert.lengthOf(array, 0)
				array[0] = 'second'
				assert.lengthOf(array, 1)
				array.undo()
				assert.lengthOf(array, 0)
				array.redo()
				assert.lengthOf(array, 1)
			})

			it('#2', () => {
				let array = initHistory([])
				assert.lengthOf(array, 0)
				array.splice(0, 0, 'first')
				assert.lengthOf(array, 1)
				array.undo()
				assert.lengthOf(array, 0)
				array.redo()
				assert.lengthOf(array, 1)
				array[0] = 'second'
				assert.lengthOf(array, 1)
				array.undo()
				assert.lengthOf(array, 1)
				array.undo()
				assert.lengthOf(array, 0)
			})

			it('#3', () => {
				let array = initHistory(['one', 'two'])
				array.push('three')
				assert.equal(array[2], 'three')
				array.pop()
				array.pop()
				array.pop()
				assert.lengthOf(array, 0)
				array.undo()
				assert.lengthOf(array, 1)
				array.redo()
				assert.lengthOf(array, 0)
				array.undo()
				array.undo()
				array.undo()
				assert.lengthOf(array, 3)
				array.undo()
				assert.lengthOf(array, 2)
				assert.equal(array[2], undefined)
				array.redo()
				assert.equal(array[2], 'three')
			})

			it('#4', () => {
				let array = initHistory(['one'])
				assert.lengthOf(array, 1)
				array.pop()
				assert.lengthOf(array, 0)
				array.push('new')
				assert.equal(array[0], 'new')
				array.undo()
				assert.lengthOf(array, 0)
				array.undo()
				assert.equal(array[0], 'one')
			})

		})

	})

})
