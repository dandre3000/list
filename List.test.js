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

let values = new Array(3).map(() => Math.random())
let list = new List(...values)

test('List.prototype.first', () => {
    expect(new List().first()).toBe(null)

    const first = list.first()
    expect(first).toBeInstanceOf(ListNode)
    expect(first.value).toBe(values[0])
})

test('List.prototype.last', () => {
    expect(new List().last()).toBe(null)

    const last = list.last()
    expect(last).toBeInstanceOf(ListNode)
    expect(last.value).toBe(values[values.length - 1])
})

test('List.prototype.length', () => {
    expect(new List().length()).toBe(0)

    let length = list.length()
    expect(length).toBe(values.length)
})

test('List.prototype.at', () => {
    expect(returnThrow(() => list.at('0'))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.at(0.1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.at(-1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.at(list.length()))).toBeInstanceOf(RangeError)

    const index = Math.floor(Math.random() * list.length())
    const node = list.at(index)
    expect(node).toBeInstanceOf(ListNode)
    expect(node.value).toBe(values[index])
})

test('ListNode.prototype.list', () => {
    expect(new ListNode().list()).toBe(null)

    const index = Math.floor(Math.random() * list.length())
    expect(new ListNode(0, list, index).list()).toStrictEqual(list)
})

test('ListNode.prototype.previous', () => {
    expect(new ListNode().previous()).toBe(null)

    const index = Math.floor(Math.random() * list.length())
    expect(list.at(index).previous()).toStrictEqual(index - 1 === -1 ? null : list.at(index - 1))
})

test('ListNode.prototype.next', () => {
    expect(new ListNode().next()).toBe(null)

    const index = Math.floor(Math.random() * list.length())
    expect(list.at(index).next()).toStrictEqual(index + 1 === list.length() ? null : list.at(index + 1))
})

test('ListNode.prototype.appendTo', () => {
    const node1 = new ListNode(Math.random())

    expect(returnThrow(() => node1.appendTo())).toBeInstanceOf(TypeError)

    expect(node1.appendTo(new ListNode)).toStrictEqual(node1)
    expect(node1.list()).toBeInstanceOf(List)

    const index = Math.floor(Math.random() * list.length())
    const node2 = list.at(index)
    const next = node2.next()

    node1.appendTo(node2)
    expect(node1.list()).toStrictEqual(list)
    expect(node1.previous()).toStrictEqual(node2)
    expect(node1.next()).toStrictEqual(next)
    expect(node2.next()).toStrictEqual(node1)
    if (next) expect(next.previous()).toStrictEqual(node1)
})

test('ListNode.prototype.prependTo', () => {
    const node1 = new ListNode(Math.random())

    expect(returnThrow(() => node1.prependTo())).toBeInstanceOf(TypeError)

    expect(node1.prependTo(new ListNode)).toStrictEqual(node1)
    expect(node1.list()).toBeInstanceOf(List)

    const index = Math.floor(Math.random() * list.length())
    const node2 = list.at(index)
    const previous = node2.previous()

    node1.prependTo(node2)
    expect(node1.list()).toStrictEqual(list)
    expect(node1.next()).toStrictEqual(node2)
    expect(node1.previous()).toStrictEqual(previous)
    expect(node2.previous()).toStrictEqual(node1)
    if (previous) expect(previous.next()).toStrictEqual(node1)
})

test('ListNode.prototype.insertInto', () => {
    const node1 = new ListNode(Math.random())

    expect(returnThrow(() => node1.insertInto({}, 0))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => node1.insertInto(list, '0'))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => node1.insertInto(list, 0.1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => node1.insertInto(list, -1))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => node1.insertInto(list, list.length() + 1))).toBeInstanceOf(RangeError)

    const index = Math.floor(Math.random() * (list.length() + 1))
    const next = index < list.length() ? list.at(index) : null
    const previous = index - 1 >= 0 ? list.at(index - 1) : null

    expect(node1.insertInto(list, index)).toBe(node1)
    expect(node1.list()).toStrictEqual(list)
    expect(node1.previous()).toStrictEqual(previous)
    expect(node1.next()).toStrictEqual(next)
    if (previous) expect(previous.next()).toStrictEqual(node1)
    if (next) expect(next.previous()).toStrictEqual(node1)
})

test('ListNode.prototype.remove', () => {
    const index = Math.floor(Math.random() * list.length())
    const node = list.at(index)
    const next = index + 1 < list.length() ? list.at(index + 1) : null
    const previous = index - 1 >= 0 ? list.at(index - 1) : null

    expect(node.remove()).toBe(node)
    expect(node.list()).toStrictEqual(null)
    expect(node.previous()).toStrictEqual(null)
    expect(node.next()).toStrictEqual(null)
    if (previous) expect(previous.next()).toStrictEqual(next)
    if (next) expect(next.previous()).toStrictEqual(previous)
})

test('List.prototype.unshift', () => {
    const length = list.length()
    const values = new Array(Math.ceil(Math.random() * 3)).map(() => Math.random())
    
    expect(list.unshift(...values)).toBe(length + values.length)
    expect(list.first().value).toBe(values[0])

    if (values.length > 1) for (let i = 1; i < values.length; i++) {
        const node = list.at(i)
        const previous = i - 1 >= 0 ? list.at(i - 1) : null
        const next = i + 1 < list.length() ? list.at(i + 1) : null

        expect(node.value).toBe(values[i])
        expect(node.list()).toStrictEqual(list)
        expect(node.previous()).toStrictEqual(previous)
        expect(node.next()).toStrictEqual(next)
    }
})

test('List.prototype.push', () => {
    let length = list.length()
    const values = new Array(Math.ceil(Math.random() * 3)).map(() => Math.random())
    
    expect(list.push(...values)).toBe(length + values.length)
    expect(list.last().value).toBe(values[values.length - 1])

    if (values.length > 1) for (let i = 1; i < values.length; i++) {
        const node = list.at(i + length)
        const previous = i + length - 1 >= 0 ? list.at(i + length - 1) : null
        const next = i + length + 1 < list.length() ? list.at(i + length + 1) : null

        expect(node.value).toBe(values[i])
        expect(node.list()).toStrictEqual(list)
        expect(node.previous()).toStrictEqual(previous)
        expect(node.next()).toStrictEqual(next)
    }
})

test('List.prototype.insert', () => {
    let length = list.length()
    const index = Math.floor(Math.random() * list.length())
    const values = new Array(Math.ceil(Math.random() * 3)).map(() => Math.random())

    expect(returnThrow(() => list.insert('0', ...values))).toBeInstanceOf(TypeError)
    expect(returnThrow(() => list.insert(0.1, ...values))).toBeInstanceOf(RangeError)
    expect(returnThrow(() => list.insert(-1, ...values))).toBeInstanceOf(RangeError)

    expect(list.insert(index, ...values)).toBe(length + values.length)

    for (let i = 0; i < values.length; i++) {
        const node = list.at(i + index)
        const previous = i + index - 1 >= 0 ? list.at(i + index - 1) : null
        const next = i + index + 1 < list.length() ? list.at(i + index + 1) : null

        expect(node.value).toBe(values[i])
        expect(node.list()).toStrictEqual(list)
        expect(node.previous()).toStrictEqual(previous)
        expect(node.next()).toStrictEqual(next)

        if (index === 0) expect(list.first()).toStrictEqual(node)
        if (index === list.length() - 1) expect(list.last()).toStrictEqual(node)
    }
})

test('List.prototype.shift', () => {
    expect(new List().shift()).toBe(null)

    const node = list.first()

    expect(list.shift()).toEqual(node)
})