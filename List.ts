/** ListNode instance #data property */
type ListNodeData<T> = {
    node: ListNode<T>
    listData: ListData<T> | null
    previous: ListNodeData<T> | null
    next: ListNodeData<T> | null
}

/** All #data property objects are stored here. */
const privateDataMap: WeakMap<ListNode<any> | List<any>, ListNodeData<any> | ListData<any>> = new Map

const thisIsNotAListNode = '"this" is not an instance of ListNode'

/** A doubly linked list node. */
export class ListNode<T> {
    static [Symbol.hasInstance] (instance) {
        try { instance.#data } catch (error) { return false }

        return true
    }

    #data: ListNodeData<T>
    value: T

    /**
     * Create a ListNode instance.
     * @throws { TypeError } if called without the new operator
     */
    constructor (value: T)

    /**
     * Create a ListNode instance and insert it into a list at the given index.
     * @throws { TypeError } if called without the new operator
     * @throws { TypeError } if list is not a List instance
     * @throws { RangeError } if the length of list >= 2 ** 24 - 1
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not an integer greater than -1 or less than the length of list + 1
     */
    constructor (value: T, list: List<T>, index: number)

    constructor (value: T, list?: List<T>, index?: number) {
        if (!new.target) throw new TypeError('List.constructor')

        const currentNodeData: ListNodeData<T> = this.#data = {
            node: this,
            listData: null,
            previous: null,
            next: null
        }

        this.value = value

        const listData = privateDataMap.get(list) as ListData<T>

        if (listData !== undefined) {
            if (listData.length >= List.maxLength)
                throw new RangeError('argument list length >= 2 ** 24 - 1')

            if (typeof index !== 'number')
                throw new TypeError('argument index is not a number')
            if (!Number.isInteger(index))
                throw new RangeError('argument index is not an integer')
            else if (index < 0 || index > listData.length)
                throw new RangeError('argument index is not valid')

            let targetNodeData: ListNodeData<T> | null = null
            let append = false

            currentNodeData.listData = listData

            // empty list
            if (listData.length === 0) {
                listData.first = listData.last = currentNodeData
                listData.length = 1

                return
            }
            // unshift; list length >= 1
            else if (index === 0) {
                targetNodeData = listData.first
            // last node; list length >= 2
            } else if (index >= listData.length - 1) {
                // prepend
                targetNodeData = listData.last

                // append
                if (index === listData.length) append = true
            // get target node; list length >= 3
            } else {
                let currentNodeData: ListNodeData<T> | null
                let forwards: boolean
                let i: number

                // only search half the list
                if (index < listData.length / 2) {
                    forwards = true

                    // skip first node
                    currentNodeData = (listData.first as ListNodeData<T>).next
                    i = 1
                } else {
                    forwards = false

                    // skip last node
                    currentNodeData = (listData.last as ListNodeData<T>).previous
                    i = listData.length - 2
                }

                while (currentNodeData) {
                    if (index === i) {
                        targetNodeData = currentNodeData

                        break
                    }

                    if (forwards) {
                        currentNodeData = currentNodeData.next
                        i++
                    } else {
                        currentNodeData = currentNodeData.previous
                        i--
                    }
                }
            }

            if (append) {
                if ((targetNodeData as ListNodeData<T>).next) {
                    ((targetNodeData as ListNodeData<T>).next as ListNodeData<T>).previous = currentNodeData
                    currentNodeData.next = (targetNodeData as ListNodeData<T>).next
                } else
                    listData.last = currentNodeData
    
                currentNodeData.previous = targetNodeData;
                (targetNodeData as ListNodeData<T>).next = currentNodeData
            } else {
                if ((targetNodeData as ListNodeData<T>).previous) {
                    ((targetNodeData as ListNodeData<T>).previous as ListNodeData<T>).next = currentNodeData
                    currentNodeData.previous = (targetNodeData as ListNodeData<T>).previous
                } else
                    listData.first = currentNodeData
    
                currentNodeData.next = targetNodeData;
                (targetNodeData as ListNodeData<T>).previous = currentNodeData
            }
    
            listData.length++
        } else if (list !== undefined)
            throw new TypeError('argument list is not a List instance')
    }

    /**
     * Return the list containing this node or null if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    list (): List<T> | null {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAListNode) }

        return this.#data.listData ? this.#data.listData.list : null
    }

    /**
     * Return the previous node in the list containing this node.
     * Return null if this is the first node in the list or if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    previous (): ListNode<T> | null {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAListNode) }

        return this.#data.previous ? this.#data.previous.node : null
    }

    /**
     * Return the next node in the list containing this node.
     * Return null if this is the last node in the list or if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    next (): ListNode<T> | null {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAListNode) }

        return this.#data.next ? this.#data.next.node : null
    }

    /**
     * Remove this node from its containing list and prepend it to another node.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { ReferenceError } if node === this
     * @throws { RangeError } if the node's list length >= 2 ** 24 - 1
     */
    prependTo (node: ListNode<T>) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAListNode) }

        let targetNodeData = node.#data
        let targetListData = targetNodeData.listData

        if (node === this)
            throw new ReferenceError('node')
        else if (targetListData && targetListData.length >= List.maxLength)
            throw new RangeError('length')

        const currentNodeData = this.#data

        // already prepended to node
        if (currentNodeData === targetNodeData.previous) return this

        // create new list if node is not in one
        if (!targetListData) {
            targetNodeData.listData = targetListData = privateDataMap.get(new List) as ListData<T>
            targetListData.first = targetNodeData
            targetListData.last = targetNodeData
            targetListData.length = 1
        } else if (targetListData.length + 1 > List.maxLength)
            throw new RangeError('List length')

        const currentListData = this.#data.listData

        // remove from current list
        if (currentListData) {
            if (currentNodeData.previous)
                currentNodeData.previous.next = currentNodeData.next
            else
                currentListData.first = currentNodeData.next
            if (currentNodeData.next)
                currentNodeData.next.previous = currentNodeData.previous
            else
                currentListData.last = currentNodeData.previous

            currentListData.length--
        }

        // prepend node
        currentNodeData.listData = targetListData

        if (targetNodeData.previous) {
            targetNodeData.previous.next = currentNodeData
            currentNodeData.previous = targetNodeData.previous
        } else
            targetListData.first = currentNodeData

        currentNodeData.next = targetNodeData
        targetNodeData.previous = currentNodeData

        targetListData.length++

        return this
    }

    /**
     * Remove this node from its containing list and append it to another node.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { ReferenceError } if node === this
     * @throws { RangeError } if the node's list length >= 2 ** 24 - 1
     */
    appendTo (node: ListNode<T>) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAListNode) }

        let targetNodeData = node.#data
        let targetListData = targetNodeData.listData

        if (node === this)
            throw new ReferenceError('node')
        else if (targetListData && targetListData.length >= List.maxLength)
            throw new RangeError('length')

        const currentNodeData = this.#data

        // already prepended to node
        if (currentNodeData === targetNodeData.previous) return this

        // create new list if node is not in one
        if (!targetListData) {
            targetNodeData.listData = targetListData = privateDataMap.get(new List) as ListData<T>
            targetListData.first = targetNodeData
            targetListData.last = targetNodeData
            targetListData.length = 1
        } else if (targetListData.length + 1 > List.maxLength)
            throw new RangeError('List length')

        const currentListData = this.#data.listData

        // remove from current list
        if (currentListData) {
            if (currentNodeData.previous)
                currentNodeData.previous.next = currentNodeData.next
            else
                currentListData.first = currentNodeData.next
            if (currentNodeData.next)
                currentNodeData.next.previous = currentNodeData.previous
            else
                currentListData.last = currentNodeData.previous

            currentListData.length--
        }

        // append node
        currentNodeData.listData = targetListData

        if (targetNodeData.next) {
            targetNodeData.next.previous = currentNodeData
            currentNodeData.next = targetNodeData.next
        } else
            targetListData.last = currentNodeData

        currentNodeData.previous = targetNodeData
        targetNodeData.next = currentNodeData

        targetListData.length++

        return this
    }

    /**
     * Remove this node from its containing list and insert it into another list at the given index.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if list is not a List instance
     * @throws { RangeError } if list length >= 2 ** 24 - 1
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not an integer greater than -1 or less than the length of list + 1
     */
    insertInto (list: List<T>, index: number) {
        let currentNodeData = this.#data

        try { currentNodeData } catch (error) { throw new TypeError(thisIsNotAListNode) }

        const targetListData = privateDataMap.get(list) as ListData<T>

        if (targetListData === undefined)
            throw new TypeError('list')
        else if (targetListData.length >= List.maxLength)
            throw new RangeError('list.length() >= 2 ** 24 - 1')

        if (typeof index !== 'number')
            throw new TypeError('argument index is not a number')
        else if (!Number.isInteger(index))
            throw new RangeError('argument index is not an integer')
        else if (index < 0 || index > targetListData.length)
            throw new RangeError('argument index is not valid')

        const currentListData = currentNodeData.listData

        // remove
        if (currentListData) {
            if (currentNodeData.previous)
                currentNodeData.previous.next = currentNodeData.next
            else
                currentListData.first = currentNodeData.next
            if (currentNodeData.next)
                currentNodeData.next.previous = currentNodeData.previous
            else
                currentListData.last = currentNodeData.previous
    
            currentListData.length--
    
            currentNodeData.listData = null
        }

        let targetNodeData: ListNodeData<T> | null = null
        let append = false

        currentNodeData.listData = targetListData

        // empty list
        if (targetListData.length === 0) {
            targetListData.first = targetListData.last = currentNodeData
            targetListData.length = 1

            return this
        }
        // unshift; list length >= 1
        else if (index === 0) {
            targetNodeData = targetListData.first
        // last node; list length >= 2
        } else if (index >= targetListData.length - 1) {
            // prepend
            targetNodeData = targetListData.last

            // append
            if (index === targetListData.length) append = true
        // get target node; list length >= 3
        } else {
            let forwards: boolean
            let i: number

            // only search half the list
            if (index < targetListData.length / 2) {
                forwards = true

                // skip first node
                targetNodeData = (targetListData.first as ListNodeData<T>).next
                i = 1
            } else {
                forwards = false

                // skip last node
                targetNodeData = (targetListData.last as ListNodeData<T>).previous
                i = targetListData.length - 2
            }

            while (targetNodeData) {
                if (index === i) break

                if (forwards) {
                    targetNodeData = targetNodeData.next
                    i++
                } else {
                    targetNodeData = targetNodeData.previous
                    i--
                }
            }
        }

        if (append) {
            if ((targetNodeData as ListNodeData<T>).next) {
                ((targetNodeData as ListNodeData<T>).next as ListNodeData<T>).previous = currentNodeData
                currentNodeData.next = (targetNodeData as ListNodeData<T>).next
            } else
                targetListData.last = currentNodeData

            currentNodeData.previous = targetNodeData;
            (targetNodeData as ListNodeData<T>).next = currentNodeData
        } else {
            if ((targetNodeData as ListNodeData<T>).previous) {
                ((targetNodeData as ListNodeData<T>).previous as ListNodeData<T>).next = currentNodeData
                currentNodeData.previous = (targetNodeData as ListNodeData<T>).previous
            } else
                targetListData.first = currentNodeData

            currentNodeData.next = targetNodeData;
            (targetNodeData as ListNodeData<T>).previous = currentNodeData
        }

        targetListData.length++

        return this
    }

    /**
     * Remove this node from its current list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    remove() {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAListNode) }

        const currentNodeData = this.#data
        const currentListData = currentNodeData.listData

        if (currentListData) {
            if (currentNodeData.previous)
                currentNodeData.previous.next = currentNodeData.next
            else
                currentListData.first = currentNodeData.next
            if (currentNodeData.next)
                currentNodeData.next.previous = currentNodeData.previous
            else
                currentListData.last = currentNodeData.previous

            currentNodeData.previous = null
            currentNodeData.next = null

            currentListData.length--
            currentNodeData.listData = null
        }

        return this
    }
}

/** List instance #data property */
type ListData<T> = {
    list: List<T>
    first: ListNodeData<T> | null
    last: ListNodeData<T> | null
    length: number
}

const thisIsNotAList = '"this" is not an instance of List'

/** Doubly linked list */
export class List<T> implements Iterable<ListNode<T>> {
    /** The maximum length of all lists. */
    static readonly maxLength = 2 ** 24 - 1

    static [Symbol.hasInstance] (instance) {
        try { instance.#data } catch (error) { return false }

        return true
    }

    #data: ListData<T>

    /**
     * Create a List instance with the specified length where all node values are undefined.
     * @throws {TypeError} if called without the new operator
     * @throws {RangeError} if length is not an integer greater than -1 or less than 2 ** 32
     */
    constructor (length: number)

    /**
     * Create a List instance and insert the given values.
     * @throws { TypeError } if called without the new operator
     */
    constructor (...values: T[])

    constructor (...values: T[]) {
        if (!new.target) throw new TypeError('List.constructor')

        // setup this
        this.#data = {
            list: this,
            first: null,
            last: null,
            length: 0
        }

        privateDataMap.set(this, this.#data)

        const length = values[0] as number

        // fill with undefined
        if (values.length === 1 && typeof length === 'number') {
            if (!Number.isInteger(length) || length < 0 || length > List.maxLength) throw new RangeError('length')

            for (let i = 0 as number; i < length; i++) {
                new ListNode(undefined, this, 0)
            }
        }
        // fill with values
        else for (const value of values) {
            new ListNode(value, this, this.#data.length)
        }
    }

    /**
     * Return the first node in this list or null if it is empty.
     * @throws { TypeError } if this is not a List instance
     */
    first () {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        return (this.#data.first ? this.#data.first.node : null)
    }

    /**
     * Return the last node in this list or null if it is empty.
     * @throws { TypeError } if this is not a List instance
     */
    last () {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        return this.#data.last ? this.#data.last.node : null
    }

    /**
     * Return the length of this list.
     * @throws { TypeError } if this is not a List instance
     */
    length () {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        return this.#data.length
    }

    /**
     * Return the node at the given index or null if index is less than -1 or greater than this length - 1
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not an integer
     */
    at (index: number): ListNode<T> | null {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof index !== 'number') throw new TypeError('index')

        const currentListData = this.#data

        if (index < 0 || index >= currentListData.length) return null
        else if (!Number.isInteger(index)) throw new RangeError('index')

        let nodeData: ListNodeData<T> | null

        // first; length >= 1
        if (index === 0)
            nodeData = currentListData.first
        // last; length >= 2
        else if (index === currentListData.length - 1)
            nodeData = currentListData.last
        // get node; length >= 3
        else {
            let forwards: boolean
            let i: number

            // only search half the list
            if (index < (currentListData.length) / 2) {
                forwards = true
                // skip first node
                nodeData = (currentListData.first as ListNodeData<T>).next
                i = 1
            } else {
                forwards = false
                // skip last node
                nodeData = (currentListData.last as ListNodeData<T>).previous
                i = currentListData.length - 2
            }

            while (nodeData) {
                if (index === i) {
                    break
                }
        
                if (forwards) {
                    nodeData = nodeData.next
                    i++
                } else {
                    nodeData = nodeData.previous
                    i--
                }
            }
        }
    
        return (nodeData as ListNodeData<T>).node
    }

    /**
     * Add the given values to the front of this list and return this length.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if list length would be greater than 2 ** 24 - 1
     */
    unshift (...values: T[]) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (this.#data.length + values.length > List.maxLength) throw new RangeError('length')

        for (let i = 0; i < values.length; i++) {
            new ListNode(values[i], this, i)
        }

        return this.#data.length
    }

    /**
     * Add the given values to the end of this list and return this length.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if list length would be greater than 2 ** 24 - 1
     */
    push (...values: T[]) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (this.#data.length + values.length > List.maxLength) throw new RangeError('length')

        for (const value of values) {
            new ListNode(value, this, this.#data.length)
        }

        return this.#data.length
    }

    /**
     * Insert the given values into this list at the given index and return this length.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not an integer greater than -1 or less than this length + 1
     * @throws { RangeError } if list length would be greater than 2 ** 24 - 1
     */
    insert (index: number, ...values: T[]) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        const valuesLength = values.length

        if (this.#data.length + valuesLength > List.maxLength) throw new RangeError('length')

        for (let i = 0; i < valuesLength; i++) {
            new ListNode(values[i], this, index + i)
        }

        return this.#data.length
    }

    /**
     * Remove the first node of this list and return it or null if this is empty.
     * @throws { TypeError } if this is not a List instance
     */
    shift () {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        const currentListData = this.#data

        // empty
        if (!currentListData.first) {
            return null
        } else {
            // remove first node from this
            const nodeData = currentListData.first

            if (nodeData.next) {
                nodeData.next.previous = null
                currentListData.first = nodeData.next
            } else
                currentListData.first = currentListData.last = null

            currentListData.length--

            nodeData.previous = null
            nodeData.next = null
            nodeData.listData = null

            return nodeData.node
        }
    }

    /**
     * Remove the last node of this list and return it or null if this is empty.
     * @throws { TypeError } if this is not a List instance
     */
    pop () {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        const currentListData = this.#data

        // empty
        if (!currentListData.last) {
            return null
        } else {
            // remove last node from this
            const nodeData = currentListData.last

            if (nodeData.previous) {
                nodeData.previous.next = null
                currentListData.last = nodeData.previous
            } else
                currentListData.first = currentListData.last = null

            currentListData.length--

            nodeData.previous = null
            nodeData.next = null
            nodeData.listData = null

            return nodeData.node
        }
    }

    /**
     * Remove a node from this list at the given index and return it.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not an integer greater than -1 or less than this length
     */
    remove (index: number) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof index !== 'number') throw new TypeError('index')
        else if (!Number.isInteger(index)) throw new RangeError('index')
        
        const currentListData = this.#data

        if (index < 0 || index > currentListData.length - 1) throw new RangeError('index')

        let nodeData: ListNodeData<T> | null = null

        if (index === 0)
            nodeData = currentListData.first
        else if (index === currentListData.length - 1)
            nodeData = currentListData.last
        else {
            let forwards: boolean
            let i: number

            // forwards
            if (index < (currentListData.length) / 2) {
                forwards = true
                nodeData = (currentListData.first as ListNodeData<T>).next as ListNodeData<T>
                i = 1
            // backwards
            } else {
                forwards = false
                nodeData = (currentListData.last as ListNodeData<T>).previous as ListNodeData<T>
                i = currentListData.length - 2
            }

            while (nodeData) {
                if (index === i) {
                    break
                }

                if (forwards) {
                    nodeData = nodeData.next as ListNodeData<T>
                    i++
                } else {
                    nodeData = nodeData.previous as ListNodeData<T>
                    i--
                }
                
            }
        }

        // remove from list
        if (nodeData.previous)
            nodeData.previous.next = nodeData.next
        else
            nodeData.listData.first = nodeData.next
        if (nodeData.next)
            nodeData.next.previous = nodeData.previous
        else
            nodeData.listData.last = nodeData.previous

        nodeData.previous = null
        nodeData.next = null
        nodeData.listData = null

        currentListData.length--

        return nodeData.node
    }

    /**
     * Remove all nodes in this list.
     * @throws { TypeError } if this is not a List instance
     */
    clear () {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        let currentListData = this.#data
        let nodeData = currentListData.first

        currentListData.first = null
        currentListData.last = null
        currentListData.length = 0

        while (nodeData) {
            const next = nodeData.next
    
            nodeData.listData = null
            nodeData.previous = null
            nodeData.next = null
    
            nodeData = next
        }

        return this
    }

    /**
     * Move one or more consecutive nodes from this list and insert them into a new list.
     * The range is defined by Math.min(start, end) to Math.max(start, end).
     * Therefore start or end can be the higher index, (List instance).splice(start, end, ...) and (List instance).splice(end, start, ...) are the same operation.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start or end is not an integer
     * @throws { RangeError } if start or end is less than 0 or greater than or equal to this length
     */
    splice (start: number, end: number): List<T>

    /**
     * Move one or more consecutive nodes from this list then insert them back into this or into another list at the given index.
     * The range is defined by Math.min(start, end) to Math.max(start, end).
     * Therefore start or end can be the higher index, (List instance).splice(start, end, ...) and (List instance).splice(end, start, ...) are the same operation.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start or end is not a number
     * @throws { RangeError } if start or end is not an integer greater than -1 or less than this length
     * @throws { TypeError } if list is not a List instance
     * @throws { RangeError } if list length would be greater than 2 ** 24 - 1
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not a integer greater than -1 or less than list length (minus number of nodes to be moved if list === this) + 1
     */
    splice (start: number, end: number, list: List<T>, index: number): List<T>

    splice (start: number, end: number, list?: List<T>, index?: number) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        const currentListData = this.#data

        if (typeof start !== 'number')
            throw new TypeError('start')
        else if (!Number.isInteger(start))
            throw new RangeError('start')
        else if (start < 0 || start > currentListData.length - 1)
            throw new RangeError('start')

        if (typeof end !== 'number')
            throw new TypeError('end')
        if (!Number.isInteger(end))
            throw new RangeError('end')
        else if (end < 0 || end > currentListData.length - 1)
            throw new RangeError('end')

        const rangeLength = Math.abs(start - end) + 1
        let targetListData: ListData<T> | null = null

        if (list instanceof List) {
            targetListData = list.#data

            if (typeof index !== 'number')
                throw new TypeError('index')
            else if (!Number.isInteger(index))
                throw new RangeError('index')
            else if (index < 0 || index > (currentListData === targetListData ? targetListData.length - rangeLength : targetListData.length))
                throw new RangeError('index')
            else if (currentListData !== targetListData && targetListData.length + rangeLength > List.maxLength)
                throw new RangeError('List length')
        } else if (list === undefined) {
            targetListData = new List<T>().#data
        } else throw new TypeError('list')

        let targetNodeData: ListNodeData<T> = null as any

        // make start the lower index
        if (end < start) {
            const _end = end

            end = start
            start = _end
        }

        // direction to iterate is based on whether the range of start to end is closer to the first or last node
        let forwards = start > currentListData.length - end - 1 ? false : true
        let startNodeData: ListNodeData<T> = null as any
        let endNodeData: ListNodeData<T> = null as any
        let currentNodeData: ListNodeData<T>| null = null
        let previous: ListNodeData<T> | null = null
        let next: ListNodeData<T> | null = null
        let i: number

        if (forwards) {
            currentNodeData = currentListData.first as ListNodeData<T>
            i = 0
        } else {
            currentNodeData = currentListData.last as ListNodeData<T>
            i = currentListData.length - 1
        }

        // whichever comes first start or end, forwards or backwards start at that node then stop at end or start
        while (currentNodeData) {
            if (i >= start && i <= end) {
                currentNodeData.listData = targetListData

                // remove start
                if (i === start) {
                    startNodeData = currentNodeData

                    if (currentNodeData.previous) {
                        previous = currentNodeData.previous
                    }

                    currentNodeData.previous = null
                }

                // remove end
                if (i === end) {
                    endNodeData = currentNodeData

                    if (currentNodeData.next) {
                        next = currentNodeData.next
                    }

                    currentNodeData.next = null
                }
            }

            if (startNodeData && endNodeData) break

            if (forwards) {
                currentNodeData = currentNodeData.next
                i++
            } else {
                currentNodeData = currentNodeData.previous
                i--
            }
        }

        // tie loose ends
        if (previous) {
            previous.next = next
        } else
            currentListData.first = next

        if (next) {
            next.previous = previous
        } else
            currentListData.last = previous
        
        currentListData.length -= rangeLength

        let append = false

        // empty list
        if (targetListData.length === 0) {
            targetListData.first = startNodeData
            targetListData.last = endNodeData
            targetListData.length += rangeLength

            return targetListData.list
        }
        // unshift; target list length >= 1
        else if (index === 0) {
            targetNodeData = targetListData.first as ListNodeData<T>
        // last node; target list length >= 2
        } else if (index >= targetListData.length - 1) {
            // prepend
            targetNodeData = targetListData.last as ListNodeData<T>

            // append
            if (index === targetListData.length) append = true
        // get target node; target list length >= 3
        } else {
            // get node from target if its a list
            if (!targetNodeData) {
                // only search half the list
                if (index < (targetListData.length) / 2) {
                    forwards = true

                    // skip first node
                    currentNodeData = (targetListData.first as ListNodeData<T>).next
                    i = 1
                } else {
                    forwards = false

                    // skip last node
                    currentNodeData = (targetListData.last as ListNodeData<T>).previous
                    i = targetListData.length - 2
                }

                while (currentNodeData) {
                    if (i === index) {
                        targetNodeData = currentNodeData

                        break
                    }

                    if (forwards) {
                        currentNodeData = currentNodeData.next
                        i++
                    } else {
                        currentNodeData = currentNodeData.previous
                        i--
                    }
                }
            }
        }

        if (append) {
            if (targetNodeData.next) {
                targetNodeData.next.previous = endNodeData
            } else
                targetListData.last = endNodeData

            startNodeData.previous = targetNodeData
            endNodeData.next = targetNodeData.next
            targetNodeData.next = startNodeData
        } else {
            if (targetNodeData.previous) {
                targetNodeData.previous.next = startNodeData
            } else
                targetListData.first = startNodeData

            startNodeData.previous = targetNodeData.previous
            endNodeData.next = targetNodeData
            targetNodeData.previous = endNodeData
        }

        targetListData.length += rangeLength

        return targetListData.list
    }

    /**
     * Set the value of all nodes in this list to the given value.
     * @throws { TypeError } if this is not a List instance
     */
    fill (value: T) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return this

        let nodeData: ListNodeData<T> | null = currentListData.first
        
        while (nodeData) {
            nodeData.node.value = value

            nodeData = nodeData.next
        }

        return this
    }

    /**
     * Reverse the order of this list.
     * @throws { TypeError } if this is not a List instance
     */
    reverse () {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        const currentListData = this.#data

        if (currentListData.length === 0) return this

        let currentNodeData = currentListData.first

        while (currentNodeData) {
            const { previous, next } = currentNodeData

            currentNodeData.previous = next
            currentNodeData.next = previous

            currentNodeData = next
        }

        const { first, last } = currentListData

        currentListData.first = last
        currentListData.last = first

        return this
    }

    /**
     * Copy the values of a range of nodes within this list to another range of nodes within this list.
     * The range is defined by Math.min(start, end) to Math.max(start, end).
     * Therefore start or end can be the higher target, (List instance).copyWithin(start, end, ...) and (List instance).copyWithin(end, start, ...) are the same operation.
     * @param targetEnd determines whether target is the start of the range of nodes whose values will be changed if false,
     * or is the end of the range if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start or end is not an integer
     * @throws { RangeError } if start or end is less than 0 or greater than or equal to this length
     * @throws { TypeError } if target is not an integer
     * @throws { RangeError } if target is less than 0 or greater than or equal to this length
     * @throws { TypeError } if targetEnd is not a boolean
     */
    copyWithin (start: number, end: number, target: number, targetEnd = false) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof start !== 'number') throw new TypeError('start')
        else if (!Number.isInteger(start)) throw new RangeError('start')
        else if (typeof end !== 'number') throw new TypeError('end')
        else if (!Number.isInteger(end)) throw new RangeError('end')
        else if (typeof target !== 'number') throw new TypeError('target')
        else if (!Number.isInteger(target)) throw new RangeError('target')

        const currentListData = this.#data

        if (start < 0 || start > currentListData.length - 1) throw new RangeError('start')
        else if (end < 0 || end > currentListData.length - 1) throw new RangeError('end')
        else if (target < 0 || target > currentListData.length - 1) throw new RangeError('target')

        if (typeof targetEnd !== 'boolean')
            throw new TypeError('targetEnd')

        // make start the lower target
        if (end < start) {
            const _end = end

            end = start
            start = _end
        }

        // direction to iterate is based on whether the range of start to end is closer to the first or last node
        let forwards = start > currentListData.length - end - 1 ? false : true
        let startNodeData: ListNodeData<T> = null as any
        let endNodeData: ListNodeData<T> = null as any
        let currentNodeData: ListNodeData<T>| null = null
        let i: number

        if (forwards) {
            currentNodeData = currentListData.first as ListNodeData<T>
            i = 0
        } else {
            currentNodeData = currentListData.last as ListNodeData<T>
            i = currentListData.length - 1
        }

        // whichever comes first start or end, forwards or backwards start at that node then stop at end or start
        while (currentNodeData) {
            if (i >= start && i <= end) {
                if (i === start) {
                    startNodeData = currentNodeData
                }

                if (i === end) {
                    endNodeData = currentNodeData
                }
            }

            if (startNodeData && endNodeData) break

            if (forwards) {
                currentNodeData = currentNodeData.next
                i++
            } else {
                currentNodeData = currentNodeData.previous
                i--
            }
        }

        // get target node
        let targetNodeData: ListNodeData<T> | null

        // unshift; target list length >= 1
        if (target === 0)
            targetNodeData = currentListData.first as ListNodeData<T>
        // last node; target list length >= 2
        else if (target === currentListData.length - 1) 
            targetNodeData = currentListData.last as ListNodeData<T>
        // get target node; target list length >= 3
        else {
            if (target < (currentListData.length) / 2) {
                forwards = true

                // skip first node
                currentNodeData = (currentListData.first as ListNodeData<T>).next
                i = 1
            } else {
                forwards = false

                // skip last node
                currentNodeData = (currentListData.last as ListNodeData<T>).previous
                i = currentListData.length - 2
            }

            while (currentNodeData) {
                if (i === target) {
                    targetNodeData = currentNodeData

                    break
                }

                if (forwards) {
                    currentNodeData = currentNodeData.next
                    i++
                } else {
                    currentNodeData = currentNodeData.previous
                    i--
                }
            }
        }

        // copy
        if (targetEnd)
            currentNodeData = endNodeData
        else
            currentNodeData = startNodeData

        let currentValue = currentNodeData.node.value
        let _currentValue

        while (targetNodeData) {
            if (targetEnd) {
                _currentValue = currentNodeData.previous?.node.value
                targetNodeData.node.value = currentValue
                currentValue = _currentValue

                if (currentNodeData === startNodeData) break

                currentNodeData = currentNodeData.previous
                targetNodeData = targetNodeData.previous
                
            } else {
                _currentValue = currentNodeData.next?.node.value
                targetNodeData.node.value = currentValue
                currentValue = _currentValue

                if (currentNodeData === endNodeData) break

                currentNodeData = currentNodeData.next
                targetNodeData = targetNodeData.next
            }
        }

        return this
    }

    /**
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     */
    sort (callback: (a: T, b: T) => number) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof callback !== 'function') throw new TypeError('callback')

        const values = []
        let nodeData: ListNodeData<T> | null = this.#data.first
        let i = 0

        while (nodeData) {
            values[i] = nodeData.node.value
            nodeData = nodeData.next
            i++
        }

        values.sort(callback)

        nodeData = this.#data.first
        i = 0

        while (nodeData) {
            nodeData.node.value = values[i]
            nodeData = nodeData.next
            i++
        }

        return this
    }

    /**
     * Return a copy of a portion of this list.
     * The range is defined by Math.min(start, end) to Math.max(start, end).
     * Therefore start or end can be the higher index, (List instance).slice(start, end) and (List instance).slice(end, start) are the same operation.
     * @param start default 0
     * @param end default this.length() - 1
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start or end is not a number
     * @throws { RangeError } if start or end is not a integer greater than -1 or less than list length
     */
    slice (start = 0, end = this.#data.length - 1) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof start !== 'number') throw new TypeError('start')
        else if (!Number.isInteger(start)) throw new RangeError('start')
        else if (typeof end !== 'number') throw new TypeError('end')
        else if (!Number.isInteger(end)) throw new RangeError('end')

        const currentListData = this.#data

        if (start < 0 || start > currentListData.length - 1) throw new RangeError('start')
        else if (end < 0 || end > currentListData.length - 1) throw new RangeError('end')

        // make start the lower index
        if (end < start) {
            const _end = end

            end = start
            start = _end
        }

        // direction to iterate is based on whether the range of start to end is closer to the first or last node
        let forwards = start > currentListData.length - end - 1 ? false : true
        let currentNodeData: ListNodeData<T>| null = null
        let i: number

        if (forwards) {
            currentNodeData = currentListData.first as ListNodeData<T>
            i = 0
        } else {
            currentNodeData = currentListData.last as ListNodeData<T>
            i = currentListData.length - 1
        }

        const newList = new List<T>

        while (currentNodeData) {
            if (forwards) {
                if (i >= start && i <= end) {
                    new ListNode(currentNodeData.node.value, newList, newList.#data.length)
                }

                currentNodeData = currentNodeData.next
                i++
            } else {
                if (i >= start && i <= end) {
                    new ListNode(currentNodeData.node.value, newList, 0)
                }

                currentNodeData = currentNodeData.previous
                i--
            }
        }

        return newList
    }

    /**
     * Return true if the value is contained in this list or false if not.
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    includes (value: T, backwards = false) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof backwards !== 'boolean') throw new TypeError('backwards')

        const currentListData = this.#data

        if (currentListData.length === 0)
            return false

        let nodeData: ListNodeData<T> | null = null
        let i: number

        if (backwards) {
            nodeData = currentListData.last
            i = currentListData.length - 1
        } else {
            nodeData = currentListData.first
            i = 0
        }

        while (nodeData) {
            if (nodeData.node.value === value)
                return true

            if (backwards) {
                nodeData = nodeData.previous
                i--
            } else {
                nodeData = nodeData.next
                i++
            }
        }

        return false
    }

    /**
     * Return the index of the first node encountered upon iterating this list that contains the given value or -1 if the value is not in the list.
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    indexOf (value: T, backwards = false) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof backwards !== 'boolean') throw new TypeError('backwards')

        const currentListData = this.#data

        if (currentListData.length === 0)
            return -1

        let nodeData: ListNodeData<T> | null = null
        let i: number

        if (backwards) {
            nodeData = currentListData.last
            i = currentListData.length - 1
        } else {
            nodeData = currentListData.first
            i = 0
        }

        while (nodeData) {
            if (nodeData.node.value === value)
                return i

            if (backwards) {
                nodeData = nodeData.previous
                i--
            } else {
                nodeData = nodeData.next
                i++
            }
        }

        return -1
    }

    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return the first node encountered where the callback returns true.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     * @throws { TypeError } if backwards is not a boolean
     */
    find (callback: (node: ListNode<T>, index: number, list: List<T>) => void, self = null, backwards = false) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof callback !== 'function') throw new TypeError('callback')

        if (typeof backwards !== 'boolean') throw new TypeError('backwards')

        const currentListData = this.#data

        if (currentListData.length === 0)
            return null

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (backwards) {
            nodeData = currentListData.last
            index = currentListData.length - 1
        } else {
            nodeData = currentListData.first
            index = 0
        }

        while (nodeData) {
            if (callback.call(self, nodeData.node, index, this) === true) return nodeData.node

            if (backwards) {
                nodeData = nodeData.previous
                index--
            } else {
                nodeData = nodeData.next
                index++
            }
        }

        return null
    }

    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return the index of the first node encountered where the callback returns true.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     * @throws { TypeError } if backwards is not a boolean
     */
    findIndex (callback: (node: ListNode<T>, index: number, list: List<T>) => void, self = null, backwards = false) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof callback !== 'function') throw new TypeError('callback')

        if (typeof backwards !== 'boolean') throw new TypeError('backwards')

        const currentListData = this.#data

        if (currentListData.length === 0)
            return -1

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (backwards) {
            nodeData = currentListData.last
            index = currentListData.length - 1
        } else {
            nodeData = currentListData.first
            index = 0
        }

        while (nodeData) {
            if (callback.call(self, nodeData.node, index, this) === true)
                return index

            if (backwards) {
                nodeData = nodeData.previous
                index--
            } else {
                nodeData = nodeData.next
                index++
            }
        }

        return -1
    }

    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return true when the callback returns true or return false.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     * @throws { TypeError } if backwards is not a boolean
     */
    some (callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self = null, backwards = false) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof callback !== 'function') throw new TypeError('callback')

        if (typeof backwards !== 'boolean') throw new TypeError('backwards')

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return false

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (backwards) {
            nodeData = currentListData.last
            index = currentListData.length - 1
        } else {
            nodeData = currentListData.first
            index = 0
        }

        while (nodeData) {
            if (callback.call(self, nodeData.node, index, this) === true)
                return true

            if (backwards) {
                nodeData = nodeData.previous
                index--
            } else {
                nodeData = nodeData.next
                index++
            }
        }

        return false
    }

    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return false when the callback does not return true or return true.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     * @throws { TypeError } if backwards is not a boolean
     */
    every (callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self = null, backwards = false) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof callback !== 'function') throw new TypeError('callback')

        if (typeof backwards !== 'boolean') throw new TypeError('backwards')

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return false

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (backwards) {
            nodeData = currentListData.last
            index = currentListData.length - 1
        } else {
            nodeData = currentListData.first
            index = 0
        }

        while (nodeData) {
            if (callback.call(self, nodeData.node, index, this) !== true) return false

            if (backwards) {
                nodeData = nodeData.previous
                index--
            } else {
                nodeData = nodeData.next
                index++
            }
        }

        return true
    }

    /**
     * Iterate this list and calls the given callback once for each node
     * using the return value of the previous call as the accumulator argument for the next call.
     * Return accumulator after the iteration is finished.
     * @param initialValue used as the value of accumulator for the initial call to the callback
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     * @throws { TypeError } if backwards is not a boolean
     */
    reduce<U> (callback: (accumulator: U, node: ListNode<T>, index: number, list: List<T>) => U, initialValue: U, self = null, backwards = false) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof callback !== 'function') throw new TypeError('callback')

        if (typeof backwards !== 'boolean') throw new TypeError('backwards')

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return initialValue

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (backwards) {
            nodeData = currentListData.last
            index = currentListData.length - 1
        } else {
            nodeData = currentListData.first
            index = 0
        }

        while (nodeData) {
            if (backwards) {
                initialValue = callback.call(self, initialValue, nodeData.node, index, this)

                nodeData = nodeData.previous
                index--
            } else {
                initialValue = callback.call(self, initialValue, nodeData.node, index, this)

                nodeData = nodeData.next
                index++
            }
        }

        return initialValue
    }

    /**
     * Iterate this list and call the given callback once for each node and remove the nodes where the callback returned true.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     * @throws { TypeError } if backwards is not a boolean
     */
    filter (callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self = null, backwards = false) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof callback !== 'function') throw new TypeError('callback')

        if (typeof backwards !== 'boolean') throw new TypeError('backwards')

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return this

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (backwards) {
            nodeData = currentListData.last
            index = currentListData.length - 1
        } else {
            nodeData = currentListData.first
            index = 0
        }

        const nodeDataArray = []

        while (nodeData) {
            let adjacent = backwards ? nodeData.previous : nodeData.next

            if (callback.call(self, nodeData.node, index, this) === true) nodeDataArray.push(nodeData)
            
            if (backwards) {
                nodeData = nodeData.previous
                index--
            } else {
                nodeData = nodeData.next
                index++
            }
        }

        for (const nodeData of nodeDataArray) {
            if (nodeData.previous)
                nodeData.previous.next = nodeData.next
            else
                nodeData.listData.first = nodeData.next
            if (nodeData.next)
                nodeData.next.previous = nodeData.previous
            else
                nodeData.listData.last = nodeData.previous

            nodeData.previous = null
            nodeData.next = null
            nodeData.listData = null

            currentListData.length--
        }

        return this
    }

    /**
     * Iterate this list and call the given callback once for each node and set its value to the returned value.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     * @throws { TypeError } if backwards is not a boolean
     */
    map <U>(callback: (node: ListNode<T>, index: number, list: List<T>) => U, self = null, backwards = false) {
                if (typeof callback !== 'function') throw new TypeError('callback')
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof callback !== 'function') throw new TypeError('callback')

        if (typeof backwards !== 'boolean') throw new TypeError('backwards')

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return this

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (backwards) {
            nodeData = currentListData.last
            index = currentListData.length - 1
        } else {
            nodeData = currentListData.first
            index = 0
        }

        const values = []

        while (nodeData) {
            values.push(callback.call(self, nodeData.node, index, this))

            if (backwards) {
                nodeData = nodeData.previous
                index--
            } else {
                nodeData = nodeData.next
                index++
            }
        }

        nodeData = currentListData.first
        index = 0

        while (nodeData) {
            nodeData.node.value = values[index]
            nodeData = nodeData.next
            index++
        }

        return this as any as List<U>
    }

    /**
     * Iterate this list and calls the given callback once for each node.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     * @throws { TypeError } if backwards is not a boolean
     */
    forEach (callback: (node: ListNode<T>, index: number, list: List<T>) => void, self = null, backwards = false) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        if (typeof callback !== 'function') throw new TypeError('callback')

        if (typeof backwards !== 'boolean') throw new TypeError('backwards')

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return this

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (backwards) {
            nodeData = currentListData.last
            index = currentListData.length - 1
        } else {
            nodeData = currentListData.first
            index = 0
        }

        while (nodeData) {
            callback.call(self, nodeData.node, index, this)

            if (backwards) {
                nodeData = nodeData.previous
                index--
            } else {
                nodeData = nodeData.next
                index++
            }
        }

        return this
    }

    /**
     * Return a new List that is populated by the contents of this list along with the given values.
     * or their contents if the value is a List.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if the new list length would be greater than 2 ** 24 - 1
     */
    concat (...values: (T | List<T>)[]) {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }
        
        let length = this.#data.length

        if (length + values.length > List.maxLength) throw new RangeError('length')

        for (const value of values) {
            if (value instanceof List) {
                length += value.#data.length
            } else
                length++

            if (length > List.maxLength) throw new RangeError('length')
        }

        const newList = new List<T>

        let nodeData = this.#data.first

        while (nodeData) {
            new ListNode(nodeData.node.value, newList, newList.#data.length)

            nodeData = nodeData.next
        }

        for (const value of values) {
            if (value instanceof List) {
                nodeData = value.#data.first
                

                while (nodeData) {
                    new ListNode(nodeData.node.value, newList, newList.#data.length)

                    nodeData = nodeData.next
                }
            } else
                new ListNode(value, newList, newList.#data.length)
        }

        return newList
    }

    /**
     * Return an array containing each node in this list.
     * @throws { TypeError } if this is not a List instance
     */
    nodes () {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        const currentListData = this.#data

        if (currentListData.length === 0)
            return []

        const array = new Array<ListNode<T>>(currentListData.length)
        let nodeData = this.#data.first
        let i = 0

        while (nodeData) {
            array[i] = nodeData.node

            nodeData = nodeData.next
            i++
        }

        return array
    }

    /**
     * Return an array containing the value of each node in this list.
     * @throws { TypeError } if this is not a List instance
     */
    values () {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        const currentListData = this.#data

        if (currentListData.length === 0)
            return []

        const array = new Array<T>(currentListData.length)
        let nodeData = this.#data.first
        let i = 0

        while (nodeData) {
            array[i] = nodeData.node.value

            nodeData = nodeData.next
            i++
        }

        return array
    }

    /**
     * Return a string representing this list.
     * @throws { TypeError } if this is not a List instance
     */
    toString () {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        const currentListData = this.#data
        let listString = ''
        
        if (currentListData.length === 0)
            return listString

        listString += `${(currentListData.first as ListNodeData<T>).node.value}`

        let nodeData = (currentListData.first as ListNodeData<T>).next
        let index = 1

        while (nodeData) {
            listString += `,${nodeData.node.value}`

            nodeData = nodeData.next
            index++
        }

        return listString
    }

    /**
     * Return an iterator representng this list.
     * @throws { TypeError } if this is not a List instance
     */
    [Symbol.iterator] (): ArrayIterator<ListNode<T>> {
        try { this.#data } catch (error) { throw new TypeError(thisIsNotAList) }

        const currentListData = this.#data

        // Array[Symbol.iterator] is faster than a custom Iterator
        if (currentListData.length === 0)
            return [][Symbol.iterator]()

        const array = new Array<ListNode<T>>(currentListData.length)
        let nodeData = this.#data.first
        let i = 0

        while (nodeData) {
            array[i] = nodeData.node

            nodeData = nodeData.next
            i++
        }

        return array[Symbol.iterator]()
    }
}

Object.defineProperty(List, 'maxLength', {
    configurable: false,
    writable: false,
    enumerable: true,
    value: List.maxLength
})