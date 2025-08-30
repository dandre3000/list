import { List, ListNode } from './List.js'
import { expect, test } from 'bun:test'

const returnThrow = (fn, ...args) => {
    try { fn(...args) } catch (error) { return error }
}

test(`"object instanceof List" using objects with the List prototype that were not created using new List will be false`, () => {
    expect(Object.create(List) instanceof List).toBeFalse()
})

test(`"object instanceof ListNode" using objects with the ListNode prototype that were not created using new ListNode will be false`, () => {
    expect(Object.create(ListNode) instanceof ListNode).toBeFalse()
})

test(`List.prototype.constructor`, () => {
    // no new operator
    expect((() => {
        try { List() } catch (error) { return error }
    })()).toBeInstanceOf(TypeError)

    // length is not an integer
    expect((() => {
        try { new List(0.1) } catch (error) { return error }
    })()).toBeInstanceOf(RangeError)

    // length is less than 0
    expect((() => {
        try { new List(-1) } catch (error) { return error }
    })()).toBeInstanceOf(RangeError)

    // length is greater than 2 ** 32 - 1
    expect((() => {
        try { new List(2 ** 32) } catch (error) { return error }
    })()).toBeInstanceOf(RangeError)

    expect(new List()).toBeInstanceOf(List)
    expect(new List(undefined, null, NaN, '', Symbol(), true, {}, () => {})).toBeInstanceOf(List)
})

test(`ListNode.prototype.constructor`, () => {
    // no new operator
    expect((() => {
        try { ListNode(0, new List, 0) } catch (error) { return error }
    })()).toBeInstanceOf(TypeError)

    // list is not a List instance
    expect((() => {
        try { new ListNode(0, {}, 0) } catch (error) { return error }
    })()).toBeInstanceOf(TypeError)

    // index is not a number
    expect((() => {
        try { new ListNode(0, new List(), '0') } catch (error) { return error }
    })()).toBeInstanceOf(TypeError)

    // index is not an integer
    expect((() => {
        try { new ListNode(0, new List(), 0.1) } catch (error) { return error }
    })()).toBeInstanceOf(RangeError)

    // index is less than 0
    expect((() => {
        try { new ListNode(0, new List, -1) } catch (error) { return error }
    })()).toBeInstanceOf(RangeError)

    // index is greater than list.length()
    expect((() => {
        try { new ListNode(0, new List, 1) } catch (error) { return error }
    })()).toBeInstanceOf(RangeError)

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

    expect(returnThrow(() => list.at('0'))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.at(0.1))).toBeInstanceOf(RangeError)

    expect(list.at(-1)).toBe(null)
    expect(list.at(list.length())).toBe(null)

    const index = Math.floor(Math.random() * list.length())
    const node = list.at(index)
    expect(node).toBeInstanceOf(ListNode)
    expect(node.value).toBe(values[index])
})

test('ListNode.prototype.list', () => {
    expect(new ListNode().list()).toBe(null)

    const list = new List()
    const index = Math.floor(Math.random() * list.length())
    expect(new ListNode(0, list, index).list()).toBe(list)
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

    expect(returnThrow(() => node1.appendTo({}))).toBeInstanceOf(TypeError)

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

    expect(returnThrow(() => node1.prependTo({}))).toBeInstanceOf(TypeError)

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

    expect(returnThrow(() => node1.insertInto({}, 0))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => node1.insertInto(list, '0'))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => node1.insertInto(list, 0.1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => node1.insertInto(list, -1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => node1.insertInto(list, list.length() + 1))).toBeInstanceOf(RangeError)

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

    expect(returnThrow(() => list.map({}))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.map(() => Math.random(), null, 'true'))).toBeInstanceOf(TypeError)

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

    expect(returnThrow(() => list.slice('0', 0))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.slice(-1, 0))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.slice(listLength, 0))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.slice(0.1, 0))).toBeInstanceOf(RangeError)

    expect(returnThrow(() => list.slice(0, '0'))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.slice(0, -1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.slice(0, listLength))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.slice(0, 0.1))).toBeInstanceOf(RangeError)

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

test('List.prototype.unshift', () => {
    const list = new List(Math.round(Math.random() * 5)).map(() => Math.random())

    let values = new Array(2 ** 32 - 1)
    expect(returnThrow(() => list.unshift(...values))).toBeInstanceOf(RangeError)

    const listLength = list.length()
    values = new Array(Math.ceil(Math.random() * 3)).map(() => Math.random())
    
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

    let values = new Array(2 ** 32 - 1)
    expect(returnThrow(() => list.push(...values))).toBeInstanceOf(RangeError)

    const listLength = list.length()
    values = new Array(Math.ceil(Math.random() * 3)).map(() => Math.random())
    
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

    let values = new Array(2 ** 32 - 1)
    expect(returnThrow(() => list.insert(index, ...values))).toBeInstanceOf(RangeError)

    values = new Array(Math.ceil(Math.random() * 3)).map(() => Math.random())
    expect(returnThrow(() => list.insert('0', ...values))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.insert(0.1, ...values))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.insert(-1, ...values))).toBeInstanceOf(RangeError)

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

    expect(returnThrow(() => list.remove('0'))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.remove(-1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.remove(list.length()))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.remove(0.1))).toBeInstanceOf(RangeError)

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

    let newList = new List(2 ** 24 - 1)
    expect(returnThrow(() => list.splice(0, 0, newList, 0))).toBeInstanceOf(RangeError)

    let listLength = list.length()
    let start = Math.floor(Math.random() * listLength)
    let end = Math.floor(Math.random() * listLength)

    expect(returnThrow(() => list.splice('0', end))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.splice(-1, end))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.splice(listLength, end))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.splice(0.1, end))).toBeInstanceOf(RangeError)

    expect(returnThrow(() => list.splice(start, '0'))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.splice(start, -1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.splice(start, listLength))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.splice(start, 0.1))).toBeInstanceOf(RangeError)

    expect(returnThrow(() => list.splice(start, end, {}))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.splice(start, end, new List, '0'))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.splice(start, end, new List, -1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.splice(start, end, new List, listLength))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.splice(start, end, new List, 0.1))).toBeInstanceOf(RangeError)

    let splicedNodes = []
    let unsplicedNodes = []

    for (let i = 0; i < listLength; i++) {
        if (i >= Math.min(start, end) && i <= Math.max(start, end))
            splicedNodes.push(list.at(i))
        else
            unsplicedNodes.push(list.at(i))
    }

    newList = list.splice(start, end)
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

    expect(returnThrow(() => list.copyWithin('0', end, index))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.copyWithin(-1, end, index))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.copyWithin(listLength, end, index))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.copyWithin(0.1, end, index))).toBeInstanceOf(RangeError)

    expect(returnThrow(() => list.copyWithin(start, '0', index))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.copyWithin(start, -1, index))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.copyWithin(start, listLength, index))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.copyWithin(start, 0.1, index))).toBeInstanceOf(RangeError)

    expect(returnThrow(() => list.copyWithin(start, end, '0'))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.copyWithin(start, end, -1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.copyWithin(start, end, listLength))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.copyWithin(start, end, 0.1))).toBeInstanceOf(RangeError)

    expect(returnThrow(() => list.copyWithin(start, end, index, 'true'))).toBeInstanceOf(TypeError)

    // targetEnd = false
    let copy = list.slice(0, listLength - 1)
    expect(list.copyWithin(start, end, index)).toBe(list)
    console.log('copyWithin', start, end, index, copy.toString(), list.toString())
    let i = 0
    let j = 0
    for (const { value } of list) {
        if (i >= index && i <= index + Math.abs(start - end)){
            expect(value).toBe(copy.at(Math.min(start, end) + j).value)
            j++
        } else
            expect(value).toBe(copy.at(i).value)
        i++
    }

    // targetEnd = true
    list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())
    listLength = list.length()
    copy = list.slice(0, listLength - 1)
    start = Math.floor(Math.random() * listLength)
    end = Math.floor(Math.random() * listLength)
    index = Math.floor(Math.random() * listLength)
    list.copyWithin(start, end, index, true)

    i = 0
    j = Math.min(start, end)
    if (index < Math.abs(start - end)) j += Math.abs(start - end) - index
    for (const { value } of list) {
        if (i >= index - Math.abs(start - end) && i <= index) {
            expect(value).toBe(copy.at(j).value)
            j++
        } else
            expect(value).toBe(copy.at(i).value)
        i++
    }
})

test('List.prototype.includes', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(returnThrow(() => list.includes(-1, 'true'))).toBeInstanceOf(TypeError)
    expect(list.includes(-1)).toBeFalse()

    const value = Math.random()
    list.insert(Math.floor(Math.random() * list.length()), value)
    expect(list.includes(value)).toBeTrue()
    expect(list.includes(value, true)).toBeTrue()
})

test('List.prototype.indexOf', () => {
    const list = new List(2 + Math.round(Math.random() * 3)).map(() => Math.random())

    expect(returnThrow(() => list.indexOf(-1, 'true'))).toBeInstanceOf(TypeError)
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
    expect(returnThrow(() => list.find(() => {}, null, 'true'))).toBeInstanceOf(TypeError)

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
    expect(returnThrow(() => list.findIndex(() => {}, null, 'true'))).toBeInstanceOf(TypeError)

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
    expect(returnThrow(() => list.some(() => {}, null, 'true'))).toBeInstanceOf(TypeError)

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
    expect(returnThrow(() => list.every(() => {}, null, 'true'))).toBeInstanceOf(TypeError)

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
    expect(returnThrow(() => list.reduce(() => {}, 0, null, 'true'))).toBeInstanceOf(TypeError)

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
    expect(returnThrow(() => list.filter(() => {}, null, 'true'))).toBeInstanceOf(TypeError)

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
    expect(returnThrow(() => list.forEach(() => {}, null, 'true'))).toBeInstanceOf(TypeError)

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
    count = list.length() - 1
    callback = (node) => {
        expect(node).toBe(list.at(count))
        count--
        return true
    }
})