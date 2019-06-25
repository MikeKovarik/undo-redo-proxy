import {assert} from 'chai'
import trackHistory from './index.mjs'


describe('Array', () => {

	describe('basic functionality', () => {

		describe('.length', () => {

			it('should be 0 on empty array', () => {
				let array = trackHistory([])
				assert.lengthOf(array, 0)
			})

			it('should be 3 on [0,1,2]', () => {
				let array = trackHistory([0,1,2])
				assert.lengthOf(array, 3)
			})

			it('should increase with items', () => {
				let raw = [0]
				let array = trackHistory(raw)
				assert.lengthOf(array, 1)
				raw[1] = 1
				assert.lengthOf(array, 2)
			})

			it('array.length = 0 should remove all items', () => {
				let array = trackHistory([0,1,2])
				assert.lengthOf(array, 3)
				array.length = 0
				assert.lengthOf(array, 0)
				assert.equal(array[0], undefined)
			})

		})

		describe('[index] notation', () => {

			it('items should reflect contents of original array', () => {
				let array = trackHistory(['hello', 'world', 42, true])
				assert.equal(array[0], 'hello')
				assert.equal(array[1], 'world')
				assert.equal(array[2], 42)
				assert.equal(array[3], true)
			})

			it('assigning item to start of empty array should work', () => {
				let array = trackHistory([])
				assert.equal(array[0], undefined)
				array[0] = 'hai'
				assert.equal(array[0], 'hai')
			})

			it('assigning item to middle of empty array should work 1', () => {
				let array = trackHistory([])
				assert.equal(array[2], undefined)
				array[2] = 'three'
				assert.equal(array[0], undefined)
				assert.equal(array[2], 'three')
				assert.lengthOf(array, 3)
			})

			it('assigning item to middle of empty array should work 2', () => {
				let array = trackHistory(['one'])
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
				let array = trackHistory(original)
				assert.equal(array[2], undefined)
				array[2] = 'three'
				assert.equal(array[0], undefined)
				assert.equal(array[2], 'three')
				assert.equal(array[4], 'five')
				assert.lengthOf(array, 5)
			})

			it('replacing item should work', () => {
				let array = trackHistory([0, 1, 2, 'before'])
				assert.equal(array[3], 'before')
				array[3] = 'after'
				assert.equal(array[3], 'after')
			})

			it('delete[index] should delete the item', () => {
				let array = trackHistory(['one', 'two', 'three'])
				assert.equal(array[1], 'two')
				delete array[1]
				assert.equal(array[1], undefined)
				assert.lengthOf(array, 3)
			})

		})

		describe('.push()', () => {

			it('should add new items to end', () => {
				let array = trackHistory([])
				array.push('one')
				array.push('two')
				assert.equal(array[0], 'one')
				assert.equal(array[1], 'two')
			})

			it('should return new length', () => {
				let array = trackHistory([])
				assert.equal(array.push('one'), 1)
				assert.equal(array.push('two'), 2)
			})

		})

		describe('.unshift()', () => {

			it('should add new items to start', () => {
				let array = trackHistory([])
				array.unshift('two')
				array.unshift('one')
				assert.equal(array[0], 'one')
				assert.equal(array[1], 'two')
			})

			it('should return new length', () => {
				let array = trackHistory([])
				assert.equal(array.unshift('one'), 1)
				assert.equal(array.unshift('two'), 2)
			})

		})

		describe('.pop()', () => {

			it('pop on empty array returns undefined', () => {
				let array = trackHistory([])
				assert.equal(array.pop(), undefined)
			})

			it('pop returns last item', () => {
				let array = trackHistory(['one', 'two'])
				assert.equal(array.pop(), 'two')
			})

		})

		describe('.shift()', () => {

			it('shift on empty array returns undefined', () => {
				let array = trackHistory([])
				assert.equal(array.shift(), undefined)
			})

			it('shift returns first item', () => {
				let array = trackHistory(['one', 'two'])
				assert.equal(array.shift(), 'one')
			})

		})

	})

	describe('history', () => {

		describe('.undo()', () => {

			it('should do nothing on empty array', () => {
				let array = trackHistory([])
				assert.lengthOf(array, 0)
				array.undo()
				assert.lengthOf(array, 0)
			})

			it('should undo replaced item', () => {
				let array = trackHistory(['initial'])
				assert.equal(array[0], 'initial')
				array[0] = 'replaced'
				assert.equal(array[0], 'replaced')
				array.undo()
				assert.equal(array[0], 'initial')
			})

			it('should undo push', () => {
				let array = trackHistory(['one'])
				assert.lengthOf(array, 1)
				array.push('two')
				assert.lengthOf(array, 2)
				array.undo()
				assert.lengthOf(array, 1)
			})

			it('should undo pushes', () => {
				let array = trackHistory(['one'])
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
				let array = trackHistory(['initial'])
				assert.lengthOf(array, 1)
				array.pop()
				assert.lengthOf(array, 0)
				array.undo()
				assert.lengthOf(array, 1)
			})

			it('should undo multiple pops (2x)', () => {
				let array = trackHistory(['one', 'two'])
				array.pop()
				array.pop()
				assert.lengthOf(array, 0)
				array.undo()
				array.undo()
				assert.equal(array[0], 'one')
				assert.equal(array[1], 'two')
			})

			it('should undo multiple pops (3x)', () => {
				let array = trackHistory(['one', 'two', 'three'])
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
				let array = trackHistory([])
				assert.lengthOf(array, 0)
				array.redo()
				assert.lengthOf(array, 0)
			})

			it('multiple redos should not have side effects', () => {
				let array = trackHistory(['initial'])
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
				let array = trackHistory(['initial'])
				array[0] = 'replaced'
				array.undo()
				assert.equal(array[0], 'initial')
				array.redo()
				assert.equal(array[0], 'replaced')
			})

			it('should redo undone pop', () => {
				let array = trackHistory(['initial'])
				assert.lengthOf(array, 1)
				array.pop()
				assert.lengthOf(array, 0)
				array.undo()
				assert.lengthOf(array, 1)
				array.redo()
				assert.lengthOf(array, 0)
			})

			it('unshift() cancels redo 2', () => {
				let array = trackHistory(['initial'])
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
				let array = trackHistory([])
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
				let array = trackHistory([])
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
				let array = trackHistory([])
				assert.lengthOf(array, 0)
				array[0] = 'second'
				assert.lengthOf(array, 1)
				array.undo()
				assert.lengthOf(array, 0)
				array.redo()
				assert.lengthOf(array, 1)
			})

			it('#2', () => {
				let array = trackHistory([])
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
				let array = trackHistory(['one', 'two'])
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
				let array = trackHistory(['one'])
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
