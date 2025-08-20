# list

Exports a `List` class that represents a doubly linked list with methods based on the `Array` class, and a `ListNode` class that represents a node that may be contained in a `List`.

## Installation

```bash
npm install @dandre3000/list
```

## Usage

```js
import { List, ListNode } from '@dandre3000/list';

// Create a new list
const list = new List(1, 2, 3);

// Add values
list.push(4, 5);
list.unshift(0);

// Remove values
list.pop();
list.shift();

// Iterate list values
for (const node of list) {
  console.log(node);
}

// Access nodes
const firstNode = list.first();
const lastNode = list.last();
const nodeAt2 = list.at(2);

// Node operations
firstNode.next();
lastNode.previous();
```

## API

[Click here to view full type definitions](https://github.com/dandre3000/list/blob/main/List.d.ts)

### ListNode

#### Properties

- `value: T` – The value stored in the node

#### Methods

- `constructor(value: T)`
  - Creates a `ListNode` instance with the given value
- `constructor(value: T, list: List<T>, index: number)`
  - Creates a `ListNode` and inserts it into the given list at the specified index
- `list(): List<T> | null`
  - Returns the list containing this node or `null` if not in a list
- `previous(): ListNode<T> | null`
  - Returns the previous node in the list or `null`
- `next(): ListNode<T> | null`
  - Returns the next node in the list or `null`
- `prependTo(node: ListNode<T>): this`
  - Removes this node from its list and prepends it to another node
- `appendTo(node: ListNode<T>): this`
  - Removes this node and appends it to another node
- `insertInto(list: List<T>, index: number): void`
  - Removes this node and inserts it into another list at the specified index
- `remove(): this`
  - Removes this node from its containing list

---

### List

#### Methods

- `constructor(length: number)`
  - Creates a List with specified length, values are undefined
- `constructor(...values: T[])`
  - Creates a `List` and inserts the given values
- `first(): ListNode<T>`
  - Returns the first node or `null` if empty
- `last(): ListNode<T>`
  - Returns the last node or `null` if empty
- `length(): number`
  - Returns the length of the list
- `at(index: number): ListNode<T>`
  - Returns the node at the given index
- `unshift(...values: T[]): number`
  - Adds values to the front and returns new length
- `push(...values: T[]): number`
  - Adds values to the end and returns new length
- `insert(index: number, ...values: T[]): number`
  - Inserts values at the specified index and returns new length
- `shift(): ListNode<T>`
  - Removes the first node and return it or `null` if empty
- `pop(): ListNode<T>`
  - Removes the last node and return it or `null` if empty
- `remove(index: number): ListNode<T>`
  - Removes and returns node at index
- `clear(): this`
  - Removes all nodes
- `splice(start: number, end: number): List<T>`
  - Moves a range of nodes into a new list
- `splice(start: number, end: number, list: List<T>, index: number): List<T>`
  - Moves a range of nodes into another list at index
- `fill(value: T): this`
  - Sets all node values to the given value
- `reverse(): this`
  - Reverses the list order
- `copyWithin(start: number, end: number, index: number, targetEnd?: boolean): this`
  - Copies values within list ranges
- `slice(start?: number, end?: number): List<T>`
  - Returns a copy of a portion of the list
- `includes(value: T, backwards?: boolean): boolean`
  - Returns `true` if value is contained in the list
- `indexOf(value: T, backwards?: boolean): number`
  - Returns the index of the value or `-1`
- `find(callback, self?, backwards?): ListNode<T>`
  - Finds the first node where callback returns `true`
- `findIndex(callback, self?, backwards?): number`
  - Finds the index of the first node where callback returns `true`
- `some(callback, self?, backwards?): boolean`
  - Returns `true` if any node matches callback
- `every(callback, self?, backwards?): boolean`
  - Returns `true` if all nodes match callback
- `reduce(callback, initialValue, self?, backwards?): U`
  - Reduces nodes using callback
- `filter(callback, self?, backwards?): this`
  - Removes nodes where callback returns `true`
- `toFilter(callback, self?, backwards?): List<T>`
  - Returns new `List` of node values where callback returns `true`
- `map(callback, self?, backwards?): List<U>`
  - Maps nodes to new values in place
- `toMapped(callback, self?, backwards?): List<U>`
  - Returns new `List` of mapped values
- `forEach(callback, self?, backwards?): this`
  - Calls callback for each node
- `concat(...values: (T | Iterable<T>)[]): List<T>`
  - Returns a new `List` with the given values appended
- `nodes(): ListNode<T>[]`
  - Returns `Array` of all nodes
- `values(): T[]`
  - Returns `Array` of all node values
- `toString(): string`
  - String representation of the list
- `[Symbol.iterator](): Iterator<T>`
  - Iterable protocol for the list

---

## License

[MIT](https://github.com/dandre3000/list/blob/main/LICENSE)
