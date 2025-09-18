import { ListNode } from './List.ts'
// package with high downloads that exports a linked list node class
import { List as LinkedList, Item } from 'linked-list'
import { Suite } from 'benchmark'

class MyItem extends Item {
    constructor (value) {
        super()

        this.value = value
    }
}

const values = new Array(10e5).fill(0).map(Math.random)
const nodes = []
const items = []

let suite1 = new Suite

suite1.add('Item.prototype.constructor', () => {
    for (let i = 0; i < values.length; i++) {
        items[i] = new MyItem(values[i])
    }
})
.add('ListNode.prototype.constructor', () => {
    for (let i = 0; i < values.length; i++) {
        nodes[i] = new ListNode(values[i])
    }
})
.on('cycle', function(event) {
    console.log(String(event.target))
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))

    suite2.run({ 'async': true })
})

let suite2 = new Suite

suite2.add('Item.prototype.prepend', () => {
    new LinkedList().prepend(items[0])

    for (let i = 0; i < items.length >>> 1; i++) {
        items[i].prepend(items[i + 1])
    }
})
.add('ListNode.prototype.prependTo', () => {
    for (let i = 0; i < nodes.length >>> 1; i++) {
        nodes[i + 1].prependTo(nodes[i])
    }
})
.on('cycle', function(event) {
    console.log(String(event.target))
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))

    suite3.run({ 'async': true })
})

let suite3 = new Suite

suite3.add('Item.prototype.append', () => {
    for (let i = items.length >>> 1 + 1; i < items.length; i++) {
        items[0].append(items[i])
    }
})
.add('ListNode.prototype.appendTo', () => {
    for (let i = nodes.length >>> 1 + 1; i < nodes.length; i++) {
        nodes[i].appendTo(nodes[0])
    }
})
.on('cycle', function(event) {
    console.log(String(event.target))
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
})

suite1.run({ 'async': true })