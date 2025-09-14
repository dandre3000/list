import { List, ListNode } from './List.js'
import { expect, test } from 'bun:test'

const returnThrow = (fn, ...args) => {
    try { fn(...args) } catch (error) { return error }
}

test(`List[Symbol.hasInstance]`, () => {
    expect(Object.create(List) instanceof List).toBeFalse()
})

test(`List.prototype.constructor`, () => {
    // no new operator
    expect(() => List()).toThrowError(TypeError)

    // length is not an integer
    expect(() => new List(0.1)).toThrowError(RangeError)

    // length is less than 0
    expect(() => new List(-1)).toThrowError(RangeError)

    // length is greater than 2 ** 32 - 1
    expect(() => new List(2 ** 32)).toThrowError(RangeError)

    expect(new List()).toBeInstanceOf(List)
    expect(new List(undefined, null, NaN, '', Symbol(), true, {}, () => {})).toBeInstanceOf(List)
})

test(`ListNode[Symbol.hasInstance]`, () => {
    expect(Object.create(ListNode) instanceof ListNode).toBeFalse()
})

test(`ListNode.prototype.constructor`, () => {
    // no new operator
    expect(() => ListNode()).toThrowError(TypeError)

    // node is not a ListNode instance
    expect(() => new ListNode(0, {})).toThrowError(TypeError)

    expect(new ListNode()).toBeInstanceOf(ListNode)
})

test('List.prototype.first', () => {
    const values = new Array(2 + Math.round(Math.random() * 3)).fill(0).map(() => Math.random())
    const list = new List(...values)

    const first = list.first()
    expect(first).toBeInstanceOf(ListNode)
    expect(first.value).toBe(values[0])
})

test('List.prototype.last', () => {  
    expect(new List().last()).toBe(null)

    const values = new Array(2 + Math.round(Math.random() * 3)).fill(0).map(() => Math.random())
    const list = new List(...values)
    const last = list.last()
    expect(last).toBeInstanceOf(ListNode)
    expect(last.value).toBe(values[values.length - 1])
})

test('List.prototype.length', () => {
    expect(new List().length()).toBe(0)

    const values = new Array(2 + Math.round(Math.random() * 3)).fill(0).map(() => Math.random())
    const list = new List(...values)
    const length = list.length()
    expect(length).toBe(values.length)
})

test('List.prototype.at', () => {
    const values = new Array(2 + Math.round(Math.random() * 3)).fill(0).map(() => Math.random())
    const list = new List(...values)

    expect(list.at(-1)).toBe(null)
    expect(list.at(list.length())).toBe(null)

    const index = Math.floor(Math.random() * list.length())
    const node = list.at(index)
    expect(node).toBeInstanceOf(ListNode)
    expect(node.value).toBe(values[index])
})

test('ListNode.prototype.list', () => {
    expect(new ListNode().list()).toBe(null)

    const list = new List(1)
    expect(list.first().list()).toBe(list)
})

test('ListNode.prototype.previous', () => {
    expect(new ListNode().previous()).toBe(null)

    const list = new List(2 + Math.round(Math.random() * 3))
    const index = Math.floor(Math.random() * list.length())
    expect(list.at(index).previous()).toBe(list.at(index - 1))
})

test('ListNode.prototype.next', () => {
    expect(new ListNode().next()).toBe(null)

    const list = new List(2 + Math.round(Math.random() * 3))
    const index = Math.floor(Math.random() * list.length())
    expect(list.at(index).next()).toBe(list.at(index + 1))
})

test('ListNode.prototype.appendTo', () => {
    const node1 = new ListNode(Math.random())

    expect(() => node1.appendTo({})).toThrowError(TypeError)

    expect(node1.appendTo(new ListNode)).toBe(node1)
    expect(node1.list()).toBeInstanceOf(List)

    const list = new List(2 + Math.round(Math.random() * 3))
    const index = Math.floor(Math.random() * list.length())
    const node2 = list.at(index)
    const next = node2.next()

    node1.appendTo(node2)
    expect(node1.list()).toBe(list)
    expect(node1.previous()).toBe(node2)
    expect(node1.next()).toBe(next)
    expect(node2.next()).toBe(node1)
    if (next) expect(next.previous()).toBe(node1)
})

test('ListNode.prototype.prependTo', () => {
    const node1 = new ListNode(Math.random())

    expect(() => node1.prependTo({})).toThrowError(TypeError)

    expect(node1.prependTo(new ListNode)).toBe(node1)
    expect(node1.list()).toBeInstanceOf(List)

    const list = new List(2 + Math.round(Math.random() * 3))
    const index = Math.floor(Math.random() * list.length())
    const node2 = list.at(index)
    const previous = node2.previous()

    node1.prependTo(node2)
    expect(node1.list()).toBe(list)
    expect(node1.next()).toBe(node2)
    expect(node1.previous()).toBe(previous)
    expect(node2.previous()).toBe(node1)
    if (previous) expect(previous.next()).toBe(node1)
})

test('ListNode.prototype.insertInto', () => {
    const node1 = new ListNode(Math.random())
    const list = new List(2 + Math.round(Math.random() * 3))

    expect(() => node1.insertInto({}, 0)).toThrowError(TypeError)
    expect(() => node1.insertInto(list, -1)).toThrowError(RangeError)
    expect(() => node1.insertInto(list, list.length() + 1)).toThrowError(RangeError)

    const index = Math.round(Math.random() * list.length())
    const next = list.at(index)
    const previous = list.at(index - 1)

    expect(node1.insertInto(list, index)).toBe(node1)
    expect(node1.list()).toBe(list)
    expect(node1.previous()).toBe(previous)
    expect(node1.next()).toBe(next)
    if (previous) expect(previous.next()).toBe(node1)
    if (next) expect(next.previous()).toBe(node1)
})

test('ListNode.prototype.remove', () => {
    const list = new List(2 + Math.round(Math.random() * 3))
    const index = Math.floor(Math.random() * list.length())
    const node = list.at(index)
    const next = list.at(index + 1)
    const previous = list.at(index - 1)

    expect(node.remove()).toBe(node)
    expect(node.list()).toBe(null)
    expect(node.previous()).toBe(null)
    expect(node.next()).toBe(null)
    if (previous) expect(previous.next()).toBe(next)
    if (next) expect(next.previous()).toBe(previous)
})

test('List.prototype[Symbol.iterator]', () => {
    let list = new List

    for (const node of list) {
        throw new Error
    }

    const values = new Array(2 + Math.round(Math.random() * 3)).fill(0).map(() => Math.random())
    list = new List(...values)
    let i = 0

    for (const node of list) {
        expect(node).toBe(list.at(i))
        i++
    }

    expect(i).toBe(list.length())
})

test('List.from', () => {
    expect(() => List.from({ [Symbol.iterator]: {} })).toThrowError(TypeError)

    let values = new Array(Math.ceil(Math.random() * 5)).fill(0).map(() => Math.random())
    let iterable = new Set(values)
    let list = List.from(iterable)

    expect(list).toBeInstanceOf(List)
    expect(list.length()).toBe(iterable.size)

    let i = 0
    for (const { value } of list) {
        expect(value).toBe(values[i])
        i++
    }

    values = new Array(Math.ceil(Math.random() * 5)).fill(0).map(() => [crypto.randomUUID(), Math.random()])
    iterable = new Map(values)
    list = List.from(iterable)

    expect(list.length()).toBe(iterable.size)

    i = 0
    for (const { value } of list) {
        expect(value[0]).toBe(values[i][0])
        expect(value[1]).toBe(values[i][1])
        i++
    }
})

test('List.prototype.nodes', () => {
    const list = new List(2 + Math.round(Math.random() * 3))

    const nodes = list.nodes()
    expect(nodes).toBeInstanceOf(Array)
    expect(nodes.length).toBe(list.length())

    let i = 0
    for (const node of list) {
        expect(node).toBe(nodes[i])
        i++
    }
})

test('List.prototype.values', () => {
    const values = new Array(2 + Math.round(Math.random() * 3)).fill(0).map(() => Math.random())
    const list = new List(...values)

    expect(list.values()).toBeInstanceOf(Array)

    let i = 0
    for (const { value } of list) {
        expect(value).toBe(values[i])
        i++
    }
})

test('List.prototype.fill', () => {
    const values = new Array(2 + Math.round(Math.random() * 3)).fill(0).map(() => Math.random())
    const list = new List(...values)
    const fillValue = Math.random()

    expect(list.fill(fillValue)).toBe(list)

    for (const node of list) {
        expect(node.value).toBe(fillValue)
    }
})

test('List.prototype.map', () => {
    const list = new List(2 + Math.round(Math.random() * 3))

    expect(() => list.map({})).toThrowError(TypeError)

    const self = {}
    let count = 0
    let callback = function (node, i, currentList) {
        expect(node).toBe(currentList.at(i))
        expect(currentList).toBe(list)
        expect(i).toBe(count)
        expect(this).toBe(self)
        count++
        return Math.random()
    }

    expect(list.map(callback, self)).toBe(list)
    expect(count).toBe(list.length())

    const values = []
    count = 0
    callback = node => {
        const result = node.value *= 2
        values.push(result)
        count++
        return result
    }

    expect(list.map(callback)).toBe(list)
    expect(count).toBe(list.length())

    let i = 0
    for (const { value } of list) {
        expect(value).toBe(values[i])
        i++
    }

    // backwards
    values.reverse()
    let j = 0

    callback = ({ value }) => {
        expect(value).toBe(values[j])
        j++
    }

    list.map(callback, null, true)
})

test('List.prototype.slice', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    const listLength = list.length()

    expect(() => list.slice(-1, 0)).toThrowError(RangeError)
    expect(() => list.slice(listLength, 0)).toThrowError(RangeError)

    expect(() => list.slice(0, -1)).toThrowError(RangeError)
    expect(() => list.slice(0, listLength)).toThrowError(RangeError)

    const start = Math.floor(Math.random() * listLength)
    const end = Math.floor(Math.random() * listLength)

    let newList = list.slice(start, end)
    const newListLength = newList.length()
    expect(newList).toBeInstanceOf(List)
    expect(newList).not.toBe(list)
    expect(newListLength).toBe(1 + Math.abs(start - end))

    let i = 0
    for (const node of newList) {
        expect(node.list()).toBe(newList)

        if (i === 0) expect(node).toBe(newList.first())
        if (i === newListLength - 1) expect(node).toBe(newList.last())
        
        expect(node.value).toBe(list.at(i + Math.min(start, end)).value)
        expect(node).not.toBe(list.at(i + Math.min(start, end)))

        i++
    }

    newList.reverse()
    i = newListLength - 1
    for (const node of newList) {
        expect(node.list()).toBe(newList)

        if (i === newListLength - 1) expect(node).toBe(newList.first())
        if (i === 0) expect(node).toBe(newList.last())
        
        expect(node.value).toBe(list.at(i + Math.min(start, end)).value)
        expect(node).not.toBe(list.at(i + Math.min(start, end)))

        i--
    }
})

test('List.prototype.reverse', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    const listLength = list.length()
    const nodes = [...list]

    expect(list.reverse()).toBe(list)

    let i = listLength - 1

    for (const node of list) {
        if (i === listLength - 1) expect(node).toBe(list.first())
        if (i === 0) expect(node).toBe(list.last())
        expect(node).toBe(nodes[i])
        i--
    }

    list.reverse()

    i = 0

    for (const node of list) {
        if (i === 0) expect(node).toBe(list.first())
        if (i === listLength - 1) expect(node).toBe(list.last())
        expect(node).toBe(nodes[i])
        i++
    }
})

test('List.prototype.toReversed', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    const listLength = list.length()
    const reversed = list.toReversed()

    expect(reversed).toBeInstanceOf(List)
    expect(reversed).not.toBe(list)
    expect(reversed.length()).toBe(listLength)

    let i = listLength - 1

    for (const node of reversed) {
        const sourceNode = list.at(i)
        expect(node).not.toBe(sourceNode)
        expect(node.value).toBe(sourceNode.value)
        i--
    }
})

test('List.prototype.unshift', () => {
    const list = new List(Math.round(Math.random() * 5)).map(() => Math.random())
    const listLength = list.length()
    const values = new Array(Math.ceil(Math.random() * 3)).map(() => Math.random())
    
    expect(list.unshift(...values)).toBe(listLength + values.length)
    expect(list.first().value).toBe(values[0])

    let i = 0
    for (const { value } of list) {
        if (i < values.length) expect(value).toBe(values[i])
        i++
    }
})

test('List.prototype.push', () => {
    const list = new List(Math.round(Math.random() * 5)).map(() => Math.random())
    const listLength = list.length()
    const values = new Array(Math.ceil(Math.random() * 3)).map(() => Math.random())
    
    expect(list.push(...values)).toBe(listLength + values.length)
    expect(list.last().value).toBe(values[values.length - 1])

    let i = 0
    for (const { value } of list) {
        if (i >= listLength) expect(value).toBe(values[i])
        i++
    }
})

test('List.prototype.insert', () => {
    const list = new List(Math.round(Math.random() * 5)).map(() => Math.random())
    const index = Math.round(Math.random() * list.length())
    const values = new Array(Math.ceil(Math.random() * 3)).map(() => Math.random())

    expect(() => list.insert(-1, ...values)).toThrowError(RangeError)

    const listLength = list.length()
    expect(list.insert(index, ...values)).toBe(listLength + values.length)

    for (let i = 0; i < values.length; i++) {
        const node = list.at(i + index)
        const previous = list.at(i + index - 1)
        const next = list.at(i + index + 1)

        expect(node.value).toBe(values[i])
        expect(node.list()).toBe(list)
        expect(node.previous()).toBe(previous)
        expect(node.next()).toBe(next)

        if (i + index === 0) expect(list.first()).toBe(node)
        if (i + index === list.length() - 1) expect(list.last()).toBe(node)
    }
})

test('List.prototype.shift', () => {
    expect(new List().shift()).toBe(null)

    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    const node = list.first()
    const next = list.at(1)

    expect(list.shift()).toBe(node)
    expect(node.list()).toBe(null)
    expect(node.previous()).toBe(null)
    expect(node.next()).toBe(null)
    expect(list.first()).toBe(next)
    if (next) expect(next.previous()).toBe(null)
})

test('List.prototype.pop', () => {
    expect(new List().pop()).toBe(null)

    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    const node = list.last()
    const previous = list.at(list.length() - 2)

    expect(list.pop()).toBe(node)
    expect(node.list()).toBe(null)
    expect(node.previous()).toBe(null)
    expect(node.next()).toBe(null)
    expect(list.last()).toBe(previous)
    if (previous) expect(previous.next()).toBe(null)
})

test('List.prototype.remove', () => {
    const list = new List(Math.round(2 + Math.random() * 3)).map(() => Math.random())

    expect(() => list.remove(-1)).toThrowError(RangeError)
    expect(() => list.remove(list.length())).toThrowError(RangeError)
    expect(() => list.remove(0.1)).toThrowError(RangeError)

    const index = Math.floor(Math.random() * list.length())
    const node = list.at(index)
    const previous = list.at(index - 1)
    const next = list.at(index + 1)

    expect(list.remove(index)).toBe(node)
    expect(node.list()).toBe(null)
    expect(node.previous()).toBe(null)
    expect(node.next()).toBe(null)
    if (previous) expect(previous.next()).toBe(next)
    if (next) expect(next.previous()).toBe(previous)
})

test('List.prototype.clear', () => {
    const list = new List(Math.round(2 + Math.random() * 3)).map(() => Math.random())
    const nodes = [...list]

    expect(list.clear()).toBe(list)
    expect(list.first()).toBe(null)
    expect(list.last()).toBe(null)
    expect(list.length()).toBe(0)

    for (let i = 0; i < nodes.length; i++) {
        expect(nodes[i].list()).toBe(null)
        expect(nodes[i].previous()).toBe(null)
        expect(nodes[i].next()).toBe(null)
    }
})

test('List.prototype.splice', () => {
    // list argument undefined
    let list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    let listLength = list.length()
    let start = Math.floor(Math.random() * listLength)
    let end = Math.floor(Math.random() * listLength)

    expect(() => list.splice(-1, end)).toThrowError(RangeError)
    expect(() => list.splice(listLength, end)).toThrowError(RangeError)

    expect(() => list.splice(start, -1)).toThrowError(RangeError)
    expect(() => list.splice(start, listLength)).toThrowError(RangeError)

    expect(() => list.splice(start, end, {})).toThrowError(TypeError)
    expect(() => list.splice(start, end, new List, -1)).toThrowError(RangeError)
    expect(() => list.splice(start, end, new List, listLength)).toThrowError(RangeError)

    let splicedNodes = []
    let unsplicedNodes = []

    for (let i = 0; i < listLength; i++) {
        if (i >= Math.min(start, end) && i <= Math.max(start, end))
            splicedNodes.push(list.at(i))
        else
            unsplicedNodes.push(list.at(i))
    }

    let newList = list.splice(start, end)
    let newListLength = newList.length()

    expect(newList).toBeInstanceOf(List)
    expect(newList).not.toBe(list)
    expect(newListLength).toBe(1 + Math.abs(start - end))
    expect(list.length()).toBe(listLength - 1 - Math.abs(start - end))

    let i = 0
    for (const node of newList) {
        expect(node.list()).toBe(newList)

        if (i === 0) expect(node).toBe(newList.first())
        if (i === newListLength - 1) expect(node).toBe(newList.last())
        
        expect(node).toBe(splicedNodes[i])

        i++
    }

    listLength = list.length()
    i = 0
    for (const node of list) {
        expect(node.list()).toBe(list)

        if (i === 0) expect(node).toBe(list.first())
        if (i === listLength - 1) expect(node).toBe(list.last())
        
        expect(node).toBe(unsplicedNodes[i])

        i++
    }

    newList.reverse()
    i = newListLength - 1
    for (const node of newList) {
        expect(node.list()).toBe(newList)

        if (i === newListLength - 1) expect(node).toBe(newList.first())
        if (i === 0) expect(node).toBe(newList.last())
        
        expect(node).toBe(splicedNodes[i])

        i--
    }

    list.reverse()
    i = listLength - 1
    for (const node of list) {
        expect(node.list()).toBe(list)

        if (i === listLength - 1) expect(node).toBe(list.first())
        if (i === 0) expect(node).toBe(list.last())
        
        expect(node).toBe(unsplicedNodes[i])

        i--
    }

    // list argument !== this
    list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    listLength = list.length()
    newList = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    newListLength = newList.length()
    start = Math.floor(Math.random() * listLength)
    end = Math.floor(Math.random() * listLength)
    let index = Math.round(Math.random() * newListLength)
    splicedNodes = []
    unsplicedNodes = []
    let newUnsplicedNodes = []

    for (let i = 0; i < listLength; i++) {
        if (i >= Math.min(start, end) && i <= Math.max(start, end))
            splicedNodes.push(list.at(i))
        else
            unsplicedNodes.push(list.at(i))
    }

    for (let i = 0; i < newListLength; i++) {
        newUnsplicedNodes.push(newList.at(i))
    }

    expect(list.splice(start, end, newList, index)).toBe(newList)
    expect(newList.length()).toBe(newListLength + 1 + Math.abs(start - end))
    expect(list.length()).toBe(listLength - 1 - Math.abs(start - end))

    newListLength = newList.length()
    i = 0
    let j = 0
    let k = 0
    for (const node of newList) {
        expect(node.list()).toBe(newList)

        if (i === 0) expect(node).toBe(newList.first())
        if (i === newListLength - 1) expect(node).toBe(newList.last())
        
        if (i >= index && i <= index + Math.abs(start - end)) {
            expect(node).toBe(splicedNodes[k])
            k++
        } else {
            expect(node).toBe(newUnsplicedNodes[j])
            j++
        }

        i++
    }

    listLength = list.length()
    i = 0
    for (const node of list) {
        expect(node.list()).toBe(list)

        if (i === 0) expect(node).toBe(list.first())
        if (i === listLength - 1) expect(node).toBe(list.last())
        
        expect(node).toBe(unsplicedNodes[i])

        i++
    }

    newList.reverse()
    i = newListLength - 1
    j = newUnsplicedNodes.length - 1
    k = splicedNodes.length - 1
    for (const node of newList) {
        expect(node.list()).toBe(newList)

        if (i === newListLength - 1) expect(node).toBe(newList.first())
        if (i === 0) expect(node).toBe(newList.last())
        
        if (i >= index && i <= index + Math.abs(start - end)) {
            expect(node).toBe(splicedNodes[k])
            k--
        } else {
            expect(node).toBe(newUnsplicedNodes[j])
            j--
        }

        i--
    }

    list.reverse()
    i = listLength - 1
    for (const node of list) {
        expect(node.list()).toBe(list)

        if (i === listLength - 1) expect(node).toBe(list.first())
        if (i === 0) expect(node).toBe(list.last())
        
        expect(node).toBe(unsplicedNodes[i])

        i--
    }

    // list argument === this
    list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    listLength = list.length()
    start = Math.floor(Math.random() * listLength)
    end = Math.floor(Math.random() * listLength)
    index = Math.round(Math.random() * (listLength - (1 + Math.abs(start - end))))
    splicedNodes = []
    unsplicedNodes = []

    for (let i = 0; i < listLength; i++) {
        if (i >= Math.min(start, end) && i <= Math.max(start, end))
            splicedNodes.push(list.at(i))
        else
            unsplicedNodes.push(list.at(i))
    }

    expect(list.splice(start, end, list, index)).toBe(list)
    expect(list.length()).toBe(listLength)

    listLength = list.length()
    i = 0
    j = 0
    k = 0
    for (const node of list) {
        expect(node.list()).toBe(list)

        if (i === 0) expect(node).toBe(list.first())
        if (i === listLength - 1) expect(node).toBe(list.last())
        
        if (i >= index && i <= index + Math.abs(start - end)) {
            expect(node).toBe(splicedNodes[k])
            k++
        } else {
            expect(node).toBe(unsplicedNodes[j])
            j++
        }

        i++
    }

    list.reverse()
    i = listLength - 1
    j = unsplicedNodes.length - 1
    k = splicedNodes.length - 1
    for (const node of list) {
        expect(node.list()).toBe(list)

        if (i === listLength - 1) expect(node).toBe(list.first())
        if (i === 0) expect(node).toBe(list.last())
        
        if (i >= index && i <= index + Math.abs(start - end)) {
            expect(node).toBe(splicedNodes[k])
            k--
        } else {
            expect(node).toBe(unsplicedNodes[j])
            j--
        }

        i--
    }
})

test('List.prototype.copyWithin', () => {
    let list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    let listLength = list.length()
    let start = Math.floor(Math.random() * listLength)
    let end = Math.floor(Math.random() * listLength)
    let index = Math.floor(Math.random() * listLength)

    expect(() => list.copyWithin(-1, end, index)).toThrowError(RangeError)
    expect(() => list.copyWithin(listLength, end, index)).toThrowError(RangeError)

    expect(() => list.copyWithin(start, -1, index)).toThrowError(RangeError)
    expect(() => list.copyWithin(start, listLength, index)).toThrowError(RangeError)

    expect(() => list.copyWithin(start, end, -1)).toThrowError(RangeError)
    expect(() => list.copyWithin(start, end, listLength)).toThrowError(RangeError)

    // targetEnd = false
    const values = list.values()
    expect(list.copyWithin(start, end, index)).toBe(list)
    let i = 0
    let j = 0
    for (const { value } of list) {
        if (i >= index && i <= index + Math.abs(start - end)){
            expect(value).toBe(values[Math.min(start, end) + j])
            j++
        } else
            expect(value).toBe(values[i])
        i++
    }

    // targetEnd = true
    list = new List(...values).copyWithin(start, end, index, true)
    console.log(start, end, index, list.toString(), values.toString())
    i = 0
    j = 0
    for (const { value } of list) {
        if (i >= index - Math.abs(start - end) && i <= index) {
            console.log(i, Math.max(start, end) - (index - i))
            expect(value).toBe(values[Math.max(start, end) - (index - i)])
            j++
        } else
            expect(value).toBe(values[i])
        i++
    }
})

test('List.prototype.includes', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(list.includes(-1)).toBeFalse()

    const value = Math.random()
    list.insert(Math.floor(Math.random() * list.length()), value)

    // forwards
    expect(list.includes(value)).toBeTrue()

    // backwards
    expect(list.includes(value, true)).toBeTrue()
})

test('List.prototype.indexOf', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(list.indexOf(-1)).toBe(-1)

    // forwards
    const value = Math.random() * -1
    let index = 0
    list.insert(index, value)
    expect(list.indexOf(value)).toBe(index)

    // backwards
    index = list.length() - 1
    list.insert(index, value)
    expect(list.indexOf(value, true)).toBe(index)
})

test('List.prototype.find', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(returnThrow(() => list.find({}))).toBeInstanceOf(TypeError)

    // forwards
    let value = Math.random() * -1
    let index = Math.floor(Math.random() * list.length())
    list.insert(index, value)

    const self = {}
    let count = 0
    let callback = function (node, i, currentList) {
        expect(node).toBe(currentList.at(i))
        expect(currentList).toBe(list)
        expect(this).toBe(self)
        count++
    }

    expect(list.find(callback, self)).toBe(null)
    expect(count).toBe(list.length())

    count = 0
    callback = node => {
        count++
        return node.value === value
    }

    expect(list.find(callback)).toBe(list.at(index))
    expect(count).toBe(index + 1)

    // backwards
    value = Math.random() * -1
    index++
    list.insert(index, value)
    count = 0
    callback = (node) => {
        count++
        return node.value === value
    }
    expect(list.find(callback, null, true)).toBe(list.at(index))
    expect(count).toBe(list.length() - index)
})

test('List.prototype.findIndex', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(returnThrow(() => list.findIndex({}))).toBeInstanceOf(TypeError)

    // forwards
    let value = Math.random() * -1
    let index = Math.floor(Math.random() * list.length())
    list.insert(index, value)

    const self = {}
    let count = 0
    let callback = function (node, i, currentList) {
        expect(node).toBe(currentList.at(i))
        expect(currentList).toBe(list)
        expect(this).toBe(self)
        count++
    }

    expect(list.findIndex(callback, self)).toBe(-1)
    expect(count).toBe(list.length())

    count = 0
    callback = node => {
        count++
        return node.value === value
    }

    expect(list.findIndex(callback)).toBe(index)
    expect(count).toBe(index + 1)

    // backwards
    value = Math.random() * -1
    index++
    list.insert(index, value)
    count = 0
    callback = (node) => {
        count++
        return node.value === value
    }
    expect(list.findIndex(callback, null, true)).toBe(index)
    expect(count).toBe(list.length() - index)
})

test('List.prototype.some', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(returnThrow(() => list.some({}))).toBeInstanceOf(TypeError)

    // forwards
    let value = Math.random() * -1
    let index = Math.floor(Math.random() * list.length())
    list.insert(index, value)

    const self = {}
    let count = 0
    let callback = function (node, i, currentList) {
        expect(node).toBe(currentList.at(i))
        expect(currentList).toBe(list)
        expect(this).toBe(self)
        count++
    }

    expect(list.some(callback, self)).toBeFalse()
    expect(count).toBe(list.length())

    count = 0
    callback = node => {
        count++
        return node.value === value
    }

    expect(list.some(callback)).toBeTrue()
    expect(count).toBe(index + 1)

    // backwards
    value = Math.random() * -1
    index++
    list.insert(index, value)
    count = 0
    callback = (node) => {
        count++
        return node.value === value
    }
    expect(list.some(callback, null, true)).toBeTrue()
    expect(count).toBe(list.length() - index)
})

test('List.prototype.every', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(returnThrow(() => list.every({}))).toBeInstanceOf(TypeError)

    // forwards
    let value = Math.random()
    let index = Math.floor(Math.random() * list.length())
    list.insert(index, value)

    const self = {}
    let count = 0
    let callback = function (node, i, currentList) {
        expect(node).toBe(currentList.at(i))
        expect(currentList).toBe(list)
        expect(this).toBe(self)
        count++
        return true
    }

    expect(list.every(callback, self)).toBeTrue()
    expect(count).toBe(list.length())

    count = 0
    callback = node => {
        count++
        return node.value !== value
    }

    expect(list.every(callback)).toBeFalse()
    expect(count).toBe(index + 1)

    // backwards
    value = Math.random()
    index++
    list.insert(index, value)
    count = 0
    callback = (node) => {
        count++
        return node.value !== value
    }
    expect(list.every(callback, null, true)).toBeFalse()
    expect(count).toBe(list.length() - index)
})

test('List.prototype.reduce', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(returnThrow(() => list.reduce({}))).toBeInstanceOf(TypeError)

    // forwards
    let value
    const self = {}
    let count = 0
    let callback = function (accumulator, node, i, currentList) {
        expect(node).toBe(currentList.at(i))
        expect(currentList).toBe(list)
        expect(this).toBe(self)
        count++
        return value = accumulator + node.value
    }

    expect(list.reduce(callback, value, self)).toBe(value)
    expect(count).toBe(list.length())

    // backwards
    count = list.length() - 1
    callback = (accumulator, node) => {
        expect(node).toBe(list.at(count))
        count--
    }

    list.reduce(callback, 0, null, true)
})

test('List.prototype.filter', () => {
    let list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(returnThrow(() => list.filter({}))).toBeInstanceOf(TypeError)

    // forwards
    const self = {}
    let count = 0
    const filteredNodes = []
    const listLength = list.length()
    let callback = function (node, i, currentList) {
        expect(node).toBe(currentList.at(i))
        expect(currentList).toBe(list)
        expect(this).toBe(self)
        count++
        if (node.value > 0.5) {
            filteredNodes.push(node)
            return true
        }
    }

    expect(list.filter(callback, self)).toBe(list)
    expect(count).toBe(listLength)
    expect(list.length()).toBe(listLength - filteredNodes.length)

    // backwards
    list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    count = list.length() - 1
    callback = (node) => {
        expect(node).toBe(list.at(count))
        count--
        return true
    }

    expect(list.filter(callback, null, true).length()).toBe(0)
})

test('List.prototype.forEach', () => {
    let list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(returnThrow(() => list.forEach({}))).toBeInstanceOf(TypeError)

    // forwards
    const self = {}
    let count = 0
    const listLength = list.length()
    let callback = function (node, i, currentList) {
        expect(node).toBe(currentList.at(i))
        expect(currentList).toBe(list)
        expect(this).toBe(self)
        count++
    }

    expect(list.filter(callback, self)).toBe(list)
    expect(count).toBe(listLength)

    // backwards
    list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    count = list.length() - 1
    callback = (node, i) => {
        expect(node).toBe(list.at(count))
        expect(i).toBe(count)
        count--
        return true
    }

    list.filter(callback, null, true)
})

test('List.prototype.concat', () => {
    let list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    const concatValues = new Array(2 + Math.round(Math.random() * 3)).fill(0).map(() => Math.random())
    const concatList = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    const flatValues = [...list.values(), ...concatValues]
    const index = Math.floor(Math.random() * concatValues.length)
    concatValues.splice(index, 0, concatList)
    flatValues.splice(index + list.length(), 0, ...concatList.values())

    const newList = list.concat(...concatValues)
    expect(newList).toBeInstanceOf(List)
    expect(newList).not.toBe(list)
    expect(newList.length()).toBe(flatValues.length)

    let i = 0
    for (const node of newList) {
        expect(node.value).toBe(flatValues[i])
        i++
    }
})

test('List.prototype.sort', () => {
    let list = new List(2 + Math.round(Math.random() * 3)).map(Math.random)

    expect(returnThrow(() => list.sort({}))).toBeInstanceOf(TypeError)

    let callback = (a, b) => {
        return b.value - a.value
    }
    const values = list.slice().nodes().sort(callback).map(({ value }) => value)
    expect(list.sort(callback)).toBe(list)
    let i = 0
    for (const node of list) {
        expect(node.value).toBe(values[i])
        if (node.next())
            expect(node.value >= node.next().value).toBeTrue()
        i++
    }
})

test('List.prototype.flat', () => {
    let list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    let listDepth1 = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    let depth1Index = Math.floor(Math.random() * list.length())
    list.at(depth1Index).value = listDepth1

    let values = [...list.values()]
    let valuesDepth1 = listDepth1.values()
    values[depth1Index] = valuesDepth1

    let flatValues = values.flat()
    expect(list.flat()).toBe(list)
    expect(list.length()).toBe(flatValues.length)

    let i = 0
    for (const { value } of list) {
        expect(value).toBe(flatValues[i])
        i++
    }

    list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    let listDepth2 = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    let depth2Index = Math.floor(Math.random() * listDepth1.length())
    listDepth1.at(depth2Index).value = listDepth2
    depth1Index = Math.floor(Math.random() * list.length())
    list.at(depth1Index).value = listDepth1

    values = [...list.values()]
    valuesDepth1 = listDepth1.values()
    values[depth1Index] = valuesDepth1
    const valuesDepth2 = listDepth2.values()
    valuesDepth1[depth2Index] = valuesDepth2

    flatValues = values.flat(2)
    expect(list.flat(2)).toBe(list)
    expect(list.length()).toBe(flatValues.length)

    i = 0
    for (const { value } of list) {
        expect(value).toBe(flatValues[i])
        i++
    }
})