import { clear, getEntries, mark, stop } from 'marky'
// package with high downloads that exports a linked list node class
import { List as LinkedList, Item } from 'linked-list'
import { ListNode } from './List.js'

class MyItem extends Item {
    constructor (value) {
        super()

        this.value = value
    }
}

const values = new Array(1000).fill(0).map(Math.random)
const nodes = []
const items = []

for (let i = 0; i < values.length; i++) {
    items[i] = new MyItem(values[i])
    nodes[i] = new ListNode(values[i])
}

mark('0')
mark('0')
clear()

setTimeout(() => {
    mark('Item.prototype.append')

    let i = 0
    new LinkedList().prepend(items[i])

    for (i = 0; i < items.length - 1; i++) {
        items[i].append(items[i + 1])
    }

    stop('Item.prototype.append')

    setTimeout(() => {
        mark('ListNode.prototype.appendTo')

        for (let i = 0; i < nodes.length - 1; i++) {
            nodes[i + 1].appendTo(nodes[i])
        }
    
        stop('ListNode.prototype.appendTo')

        setTimeout(() => getEntries().forEach(({ name, duration }) => console.log(name, duration)))
    })
})