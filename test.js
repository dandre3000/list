import { List } from './List.js'

let list = new List(0, 1, 2, 3, 4, 5, 6, 7, 8, 9)

console.log('list.first', list.first())
console.log('list.last', list.last())
console.log('list.last().previous()', list.last().previous())
console.log('list.length', list.length())

const node = list.at(0)

console.log('\n***')
console.log('list.at', node)
console.log('node.list', node.list())
console.log('node.previous', node.previous())
console.log('node.next', node.next())
console.log('***\n')

console.log('list.copyWithin', list.copyWithin(5, 9, 1).toString())

let mapped = list.map(({ value }) => `${value}`)
console.log('list.map', mapped)

console.log('***\n')
for (const { value } of list) {
    console.log(value)
}
console.log('***\n')