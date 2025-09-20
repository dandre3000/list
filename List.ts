/** ListNode instance #data property */
type ListNodeData<T> = {
    node: ListNode<T>
    listData: ListData<T> | null
    previous: ListNodeData<T> | null
    next: ListNodeData<T> | null
}

// allow access to ListNode instance #data property in List methods
let privateListNodeData: ListNodeData<any>

/** A doubly linked list node. */
export class ListNode<T> {
    static [Symbol.hasInstance] (instance) {
        try { instance.#data } catch (error) { return false }

        return true
    }

    #data: ListNodeData<T>

    value: T

    [Symbol.toStringTag] = this.constructor.name

    /**
     * Create a ListNode instance.
     * @param value The value this node will contain.
     */
    constructor (value?: T)

    /**
     * Create a ListNode instance and append or prepend it to another node.
     * @param value The value this node will contain.
     * @param node The node that will be appended or prepended with this.
     * @param append If the append argument is truthy then append this to node else prepend this to node. (default false)
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { RangeError } if node.list.length would exceed List.maxLength
     */
    constructor (value: T, node: ListNode<T>, append?)

    constructor (value: T, node?: ListNode<T>, append = false) {
        let targetNodeData: ListNodeData<T>
        let targetListData: ListData<T> | null = null

        if (node) {
            try { targetNodeData = node.#data } catch (error) {
                throw new TypeError(`node argument (${Object.prototype.toString.call(node)}) is not a ListNode instance`)
            }

            targetListData = targetNodeData.listData

            if (targetListData && targetListData.length >= List.maxLength)
                throw new RangeError(`node.list.length (${targetListData.length}) would exceed List.maxLength (16777216)`)
        }

        const currentNodeData: ListNodeData<T> = privateListNodeData = this.#data = {
            node: this,
            listData: targetListData,
            previous: null,
            next: null
        }

        this.value = value

        if (!targetNodeData) return

        if (!targetListData) {
            new List // privateListData = new List().#data

            targetNodeData.listData = targetListData = privateListData
            targetListData.first = targetListData.last = targetNodeData
            targetListData.length = 2
            currentNodeData.listData = targetListData
        } else
            targetListData.length++

        if (!!append === true) {
            if (targetNodeData.next) {
                targetNodeData.next.previous = currentNodeData
                currentNodeData.next = targetNodeData.next
            } else
                targetListData.last = currentNodeData

            currentNodeData.previous = targetNodeData
            targetNodeData.next = currentNodeData
        } else {
            if (targetNodeData.previous) {
                targetNodeData.previous.next = currentNodeData
                currentNodeData.previous = targetNodeData.previous
            } else
                targetListData.first = currentNodeData

            currentNodeData.next = targetNodeData
            targetNodeData.previous = currentNodeData
        }
    }

    /**
     * The list containing this node or null if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    get list (): List<T> | null {
        try { return this.#data.listData?.list || null } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }
    }

    /**
     * The previous node in this list or null if this is the first node in the list or if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    get previous (): ListNode<T> | null {
        try { return this.#data.previous?.node || null } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }
    }

    /**
     * The next node in this list or null if this is the last node in the list or if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    get next (): ListNode<T> | null {
        try { return this.#data.next?.node || null } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }
    }

    /**
     * Remove this node from its containing list and prepend it to another node.
     * Creates a new list to contain both nodes if node.list === null.
     * @param node The node that will be prepended with this.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { ReferenceError } if node === this
     * @throws { RangeError } if node.list.length would exceed List.maxLength (16777216)
     */
    prependTo (node: ListNode<T>) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }

        try { node.#data } catch (error) {
            throw new TypeError(`node argument (${Object.prototype.toString.call(node)}) is not a ListNode instance`)
        }

        const currentNodeData = this.#data
        let targetNodeData = node.#data
        let targetListData = targetNodeData.listData

        if (targetListData) {
            if (targetListData.length >= List.maxLength)
                throw new RangeError(`node.list.length (${targetListData.length}) would exceed List.maxLength (16777216)`)

            // already prepended to node
            if (currentNodeData === targetNodeData.previous) return this
        } // create new list if node is not in one
        else {
            new List
            targetNodeData.listData = targetListData = privateListData
            targetListData.first = targetNodeData
            targetListData.last = targetNodeData
            targetListData.length = 1
        }

        const currentListData = currentNodeData.listData

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

        targetListData.length++
        currentNodeData.listData = targetListData

        // prepend node
        if (targetNodeData.previous) {
            targetNodeData.previous.next = currentNodeData
            currentNodeData.previous = targetNodeData.previous
        } else
            targetListData.first = currentNodeData

        currentNodeData.next = targetNodeData
        targetNodeData.previous = currentNodeData

        return this
    }

    /**
     * Remove this node from its containing list and append it to another node.
     * Creates a new list to contain both nodes if node.list === null.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { ReferenceError } if node === this
     * @throws { RangeError } if the node's list length would exceed List.maxLength (16777216)
     */
    appendTo (node: ListNode<T>) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }

        const currentNodeData = this.#data

        try { node.#data } catch (error) {
            throw new TypeError(`node argument (${Object.prototype.toString.call(node)}) is not a ListNode instance`)
        }

        let targetNodeData = node.#data
        let targetListData = targetNodeData.listData

        if (targetListData) {
            if (targetListData.length >= List.maxLength)
                throw new RangeError(`node.list.length (${targetListData.length}) would exceed List.maxLength (16777216)`)

            // already appended to node
            if (currentNodeData === targetNodeData.next) return this
        } // create new list if node is not in one
        else {
            new List
            targetNodeData.listData = targetListData = privateListData
            targetListData.first = targetNodeData
            targetListData.last = targetNodeData
            targetListData.length = 1
        }

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


        targetListData.length++
        currentNodeData.listData = targetListData

        // append
        if (targetNodeData.next) {
            targetNodeData.next.previous = currentNodeData
            currentNodeData.next = targetNodeData.next
        } else
            targetListData.last = currentNodeData

        currentNodeData.previous = targetNodeData
        targetNodeData.next = currentNodeData

        return this
    }

    /**
     * Remove this node from its containing list and insert it into another list.
     * @param list The list that will contain this node.
     * @param index The position in the list that this node will occupy. (default 0)
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if list is not a List instance
     * @throws { RangeError } if list length would exceed List.maxLength (16777216)
     * @throws { TypeError } if index can not be converted to a number
     * @throws { RangeError } if index is not greater than or equal to 0 and less than or equal to list.length
     */
    insertInto (list: List<T>, index = 0) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }

        // privateListData = list.#data
        if (!(list instanceof List))
            throw new TypeError(`list argument (${Object.prototype.toString.call(list)}) is not a List instance`)

        if (privateListData.length >= List.maxLength)
            throw new RangeError(`list.length (${privateListData.length}) + 1 would exceed List.maxLength (16777216)`)

        // convert to number
        index >>= 0

        if (index < 0 || index > privateListData.length)
            throw new RangeError(`index argument (${index}) is not greater than or equal to 0 and less than or equal to list.length ${privateListData.length}`)

        let currentNodeData = this.#data
        const currentListData = currentNodeData.listData

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

        let targetNodeData: ListNodeData<T> | null = null
        let append = false

        currentNodeData.listData = privateListData

        // empty list
        if (privateListData.length === 0) {
            privateListData.first = privateListData.last = currentNodeData
            privateListData.length = 1

            return this
        }

        // first node
        if (index === 0)
            targetNodeData = privateListData.first
        // last node
        else if (index >= privateListData.length - 1) {
            // prepend
            targetNodeData = privateListData.last

            // append
            if (index === privateListData.length) append = true
        } // get target node; O (n / 2)
        else {
            let i: number

            // forwards; Math.floor(list.length / 2)
            if (index < privateListData.length >>> 1) {
                // skip first node
                targetNodeData = (privateListData.first as ListNodeData<T>).next
                i = 1

                while (targetNodeData) {
                    if (index === i) break
    
                    targetNodeData = targetNodeData.next
                    i++
                }
            } // backwards
            else {
                // skip last node
                targetNodeData = (privateListData.last as ListNodeData<T>).previous
                i = privateListData.length - 2

                while (targetNodeData) {
                    if (index === i) break
    
                    targetNodeData = targetNodeData.previous
                    i--
                }
            }
        }

        // already inserted into the list at the given index
        if (currentNodeData === targetNodeData) return this

        privateListData.length++

        // insert
        if (append) {
            if (targetNodeData.next) {
                targetNodeData.next.previous = currentNodeData
                currentNodeData.next = targetNodeData.next
            } else
                privateListData.last = currentNodeData

            currentNodeData.previous = targetNodeData
            targetNodeData.next = currentNodeData
        } else {
            if (targetNodeData.previous) {
                targetNodeData.previous.next = currentNodeData
                currentNodeData.previous = targetNodeData.previous
            } else
                privateListData.first = currentNodeData

            currentNodeData.next = targetNodeData
            targetNodeData.previous = currentNodeData
        }

        return this
    }

    /**
     * Remove this node from its current list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    remove () {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }

        const nodeData = this.#data
        const listData = nodeData.listData

        if (listData) {
            if (nodeData.previous)
                nodeData.previous.next = nodeData.next
            else
                listData.first = nodeData.next
            if (nodeData.next)
                nodeData.next.previous = nodeData.previous
            else
                listData.last = nodeData.previous

            nodeData.previous = null
            nodeData.next = null

            listData.length--
            nodeData.listData = null
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

interface ListIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): ListIterator<T>;
}

// allow access to List instance #data property in ListNode methods
let privateListData: ListData<any>

/** Doubly linked list */
export class List<T> {
    /** The maximum length of all lists. */
    static readonly maxLength = 16777216

    /**
     * Create a new, shallow-copied List instance from an iterable.
     * @param items An iterable to convert to a List.
     */
    static from<T> (items: Iterable<T>): List<T>

    /**
     * Create a new, shallow-copied List instance from an iterable.
     * @param items An iterable to convert to a List.
     * @param mapFn A function to call on every element of the iterable.
     * If provided, every value to be added to the list is first passed through this function,
     * and mapFn's return value is added to the list instead.
     * The function is called with the following arguments:
     *
     * element: The current element being processed in the iterable.
     *
     * index: The index of the current element being processed in the iterable.
     * @param self Value to use as this when executing mapFn.
     */
    static from<T, U> (items: Iterable<T>, mapFn: (element: T, index: number) => U, self?: any): List<U>

    static from<T, U> (items: Iterable<T>, mapFn?: (element: T, index: number) => U, self = null) {
        const typeOfItemsSymbolIterator = items?.[Symbol.iterator]

        if (typeof typeOfItemsSymbolIterator !== 'function')
            throw new TypeError(`items[Symbol.iterator] (${typeOfItemsSymbolIterator}) is not a function`)

        const typeofMapFn = typeof mapFn

        if (mapFn !== undefined && typeofMapFn !== 'function')
            throw new TypeError(`mapFn argument (${typeofMapFn}) is not a function`)

        const iterator = items[Symbol.iterator]()
        let result = iterator.next()

        const list = new List

        if (result?.done === true)
            return list
        if (mapFn === undefined) {
            new ListNode(result?.value)
            
            privateListData.first = privateListData.last = privateListNodeData
            privateListData.length = 1
            privateListNodeData.listData = privateListData

            result = iterator.next()

            while (result?.done !== true) {
                new ListNode(result?.value, privateListNodeData.node, true)

                result = iterator.next()
            }
        } else {
            let i = 0

            new ListNode(mapFn.call(self, result.value, i))

            privateListData.first = privateListData.last = privateListNodeData
            privateListData.length = 1
            privateListNodeData.listData = privateListData

            result = iterator.next()

            while (result.done !== true) {
                new ListNode(mapFn.call(self, result.value, ++i), privateListNodeData.node, true)

                result = iterator.next()
            }
        }

        return list
    }

    /**
     * Asynchronously create a new, shallow-copied List instance from an iterable.
     * @param items An iterable to convert to a List.
     */
    static async fromAsync<T> (items: Iterable<T> | AsyncIterable<T>): Promise<List<T>>

    /**
     * Asynchronously create a new, shallow-copied List instance from an iterable.
     * @param items An iterable to convert to a list.
     * @param mapFn A function to call on every element of the list.
     * If provided, every value to be added to the list is first passed through this function,
     * and mapFn's return value is added to the list instead (after being awaited).
     * The function is called with the following arguments:
     *
     * element: The current element being processed in the list.
     * If items is a sync iterable then all elements are first awaited, and element will never be a thenable.
     * If items is an async iterable, then each yielded value is passed as-is.
     *
     * index: The index of the current element being processed in the iterable.
     * @param self Value to use as this when executing mapFn.
     */
    static async fromAsync<T, U> (items: Iterable<T> | AsyncIterable<T>, mapFn: (element: T, index: number) => U, self?: any): Promise<List<U>>

    static async fromAsync<T, U> (items: Iterable<T> | AsyncIterable<T>, mapFn?: (element: T, index: number) => U, self = null) {
        const typeOfItemsSymbolAsyncIterator = items?.[Symbol.asyncIterator]
        let symbol

        if (typeof typeOfItemsSymbolAsyncIterator !== 'function') {
            const typeOfItemsSymbolIterator = items?.[Symbol.iterator]

            if (typeof typeOfItemsSymbolIterator !== 'function')
                throw new TypeError(`neither items[Symbol.asyncIterator] (${typeOfItemsSymbolAsyncIterator}) or items[Symbol.iterator] (${typeOfItemsSymbolIterator}) is a function`)

            symbol = Symbol.iterator
        } else
            symbol = Symbol.asyncIterator

        const typeofMapFn = typeof mapFn

        if (mapFn !== undefined && typeofMapFn !== 'function')
            throw new TypeError(`mapFn argument (${typeofMapFn}) is not a function`)

        const iterator = items[symbol]()
        let result = await iterator.next()

        const list = new List

        let resolve: (value: List<any>) => void
        const promise = new Promise(_resolve => resolve = _resolve)

        if (result.done === false) {
            if (mapFn === undefined) {
                new ListNode(result.value)
                
                privateListData.first = privateListData.last = privateListNodeData
                privateListData.length = 1
                privateListNodeData.listData = privateListData

                result = await iterator.next()

                while (result.done !== true) {
                    new ListNode(result.value, privateListNodeData.node, true)

                    result = await iterator.next()
                }
            } else {
                let i = 0

                new ListNode(mapFn.call(self, result.value, i))

                privateListData.first = privateListData.last = privateListNodeData
                privateListData.length = 1
                privateListNodeData.listData = privateListData

                result = await iterator.next()

                while (result.done !== true) {
                    new ListNode(mapFn.call(self, result.value, ++i), privateListNodeData.node, true)

                    result = await iterator.next()
                }
            }
        }

        resolve(list)

        return promise
    }

    static [Symbol.hasInstance] (instance) {
        try { privateListData = instance.#data } catch (error) { return false }

        return true
    }

    #data: ListData<T>

    [Symbol.toStringTag] = this.constructor.name

    /**
     * Create a List instance with the specified length where all node values are undefined.
     * @param length The amount of nodes this list will initially contain.
     * @throws {RangeError} if length is not an integer greater than -1 and less than List.maxLength (16777216)
     */
    constructor (length: number)

    /**
     * Create a List instance and insert the given values.
     * @param values The values this list will initially contain.
     */
    constructor (...values: T[])

    constructor (...values: T[]) {
        const listData = privateListData = this.#data = {
            list: this,
            first: null,
            last: null,
            length: 0
        }

        const length = values[0] as number

        // fill with undefined
        if (values.length === 1 && typeof length === 'number') {
            if (!Number.isInteger(length))
                throw new RangeError(`length argument (${length}) is not an integer`)
            else if (length < 0)
                throw new RangeError(`length argument (${length}) is less than 0`)
            else if (length > List.maxLength)
                throw new RangeError(`length argument (${length}) is greater than List.maxLength (16777216)`)

            if (length > 0) {
                new ListNode(undefined)

                privateListNodeData.listData = listData
                listData.first = listData.last = privateListNodeData
                listData.length = 1
            }

            for (let i = 1; i < length; i++) {
                new ListNode(undefined, privateListNodeData.node, true)
            }
        } // fill with values
        else {
            if (values.length > 0) {
                new ListNode(values[0])

                privateListNodeData.listData = listData
                listData.first = listData.last = privateListNodeData
                listData.length = 1
            }

            for (let i = 1; i < values.length; i++) {
                new ListNode(values[i], privateListNodeData.node, true)
            }
        }
    }

    /**
     * The first node in this list or null if this is empty.
     * @throws { TypeError } if this is not a List instance
     */
    get first () {
        try { return (this.#data.first?.node || null) } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }
    }

    /**
     * The last node in this list or null if this is empty.
     * @throws { TypeError } if this is not a List instance
     */
    get last () {
        try { return (this.#data.last?.node || null) } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }
    }

    /**
     * The length of this list.
     * @throws { TypeError } if this is not a List instance
     */
    get length () {
        try { return this.#data.length } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }
    }

    /**
     * Return the node at the given index or null if index is out of bounds.
     * @param index The position of the node. (default 0)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if index can not be converted to a number
     */
    at (index = 0): ListNode<T> | null {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const listData = this.#data

        // convert to number
        index >>= 0

        if (index < 0 || index > listData.length - 1)
            return null

        let nodeData: ListNodeData<T> | null

        // first
        if (index === 0)
            nodeData = listData.first
        // last
        else if (index === listData.length - 1)
            nodeData = listData.last
        // get target node; O (n / 2)
        else {
            let i: number

            // forwards; Math.floor(this.length / 2)
            if (index < listData.length >>> 1) {
                // skip first node
                nodeData = listData.first.next
                i = 1

                while (nodeData) {
                    if (index === i) break
            
                    nodeData = nodeData.next
                    i++
                }
            } // backwards
            else {
                // skip last node
                nodeData = listData.last.previous
                i = listData.length - 2

                while (nodeData) {
                    if (index === i) break
            
                    nodeData = nodeData.previous
                    i--
                }
            }
        }
    
        return nodeData.node
    }

    /**
     * Insert the values to the front of this list and return this length.
     * @param values The values to be inserted.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if list.length would exceed List.maxLength (16777216)
     */
    unshift (...values: T[]) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        let listData = this.#data

        if (listData.length + values.length > List.maxLength)
            throw new RangeError(`this().length (${listData.length}) would exceed List.maxLength (16777216)`)

        if (values.length > 0) {
            let i = values.length - 1

            if (listData.length === 0) {
                new ListNode(values[i])
                privateListNodeData.listData = listData

                listData.first = listData.last = privateListNodeData
                listData.length = 1

                i--
            }

            for (i; i > -1; i--) {
                new ListNode(values[i], listData.first.node)
            }
        }

        return listData.length
    }

    /**
     * Insert the values to the end of this list and return this length.
     * @param values The values to be inserted.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if list.length would exceed List.maxLength (2 ** 24 - 1)
     */
    push (...values: T[]) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        let listData = this.#data

        if (this.#data.length + values.length > List.maxLength)
            throw new RangeError(`this().length (${listData.length}) would exceed List.maxLength (16777216)`)

        if (values.length > 0) {
            let i = 0

            if (listData.length === 0) {
                new ListNode(values[i])
                privateListNodeData.listData = listData

                listData.first = listData.last = privateListNodeData
                listData.length = 1

                i = 1
            }

            for (i; i < values.length; i++) {
                new ListNode(values[i], listData.last.node, true)
            }
        }

        return listData.length
    }

    /**
     * Insert the values into this list at the given index and return this length.
     * @param index The position where values will be inserted. (default 0)
     * @param values The values to be inserted.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if index can not be converted to a number
     * @throws { RangeError } if index is not greater than or equal to 0 and less than or equal to this.length
     * @throws { RangeError } if this.length would exceed List.maxLength (2 ** 24 - 1)
     */
    insert (index = 0, ...values: T[]) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const listData = this.#data
        const valuesLength = values.length

        if (listData.length + valuesLength > List.maxLength)
            throw new RangeError(`this().length (${listData.length}) would exceed List.maxLength (16777216)`)

        // convert to number
        index >>= 0

        if (index < 0 || index > listData.length)
            throw new RangeError(`index argument (${index}) is not greater than or equal to 0 and less than or equal to this.length (${listData.length})`)

        let nodeData: ListNodeData<T>
        let append = false
        let i = valuesLength - 1

        // first node
        if (index === 0) {
            if (listData.length === 0) {
                new ListNode(values[i])
                privateListNodeData.listData = listData

                listData.first = listData.last = privateListNodeData
                listData.length = 1

                i--
            }

            nodeData = listData.first
        } // last node
        else if (index >= listData.length - 1) {
            nodeData = listData.last

            if (index === listData.length) {
                append = true
                i = 0
            }
        } // get node; O (n / 2)
        else {
            let i: number

            // forwards; Math.floor(this.length / 2)
            if (index < listData.length >>> 1) {
                // skip first node
                nodeData = listData.first.next
                i = 1

                while (nodeData !== null) {
                    if (index === i) break

                    nodeData = nodeData.next
                    i++
                }
            } // backwards
            else {
                // skip last node
                nodeData = listData.last.previous
                i = listData.length - 2

                while (nodeData !== null) {
                    if (index === i) break

                    nodeData = nodeData.previous
                    i--
                }
            }
        }

        let node = nodeData.node

        if (append) for (i; i < valuesLength; i++) {
            node = new ListNode(values[i], node, append)
        } else for (i; i > -1; i--) {
            node = new ListNode(values[i], node)
        }

        return listData.length
    }

    /**
     * Remove the first node of this list and return it or null if this is empty.
     * @throws { TypeError } if this is not a List instance
     */
    shift () {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const listData = this.#data

        // empty
        if (!listData.first) {
            return null
        } else {
            // remove first node from this
            const nodeData = listData.first

            if (nodeData.next) {
                nodeData.next.previous = null
                listData.first = nodeData.next
            } else
                listData.first = listData.last = null

            listData.length--

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
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const listData = this.#data

        // empty
        if (!listData.last) {
            return null
        } else {
            // remove last node from this
            const nodeData = listData.last

            if (nodeData.previous) {
                nodeData.previous.next = null
                listData.last = nodeData.previous
            } else
                listData.first = listData.last = null

            listData.length--

            nodeData.previous = null
            nodeData.next = null
            nodeData.listData = null

            return nodeData.node
        }
    }

    /**
     * Remove a node from this list at the given index and return it.
     * @param index The position of the node.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if index is not an integer greater than -1 or less than this length
     */
    remove (index: number) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const listData = this.#data

        index >>= 0

        if (index < 0 || index > listData.length - 1)
            throw new RangeError(`index argument (${index}) is not greater than or equal to 0 and less than this.length (${listData.length})`)

        let nodeData: ListNodeData<T> | null = null

        // first node
        if (index === 0)
            nodeData = listData.first
        // last node
        else if (index === listData.length - 1)
            nodeData = listData.last
        // get target node; O (n / 2)
        else {
            let i: number

            // forwards; Math.floor(list.length / 2)
            if (index < (listData.length) >>> 1) {
                nodeData = (listData.first as ListNodeData<T>).next as ListNodeData<T>
                i = 1

                while (nodeData) {
                    if (index === i) {
                        break
                    }

                    nodeData = nodeData.next as ListNodeData<T>
                    i++
                }
            } // backwards
            else {
                nodeData = (listData.last as ListNodeData<T>).previous as ListNodeData<T>
                i = listData.length - 2

                while (nodeData) {
                    if (index === i) break

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

        listData.length--

        return nodeData.node
    }

    /**
     * Remove all nodes in this list.
     * @throws { TypeError } if this is not a List instance
     */
    clear () {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        let listData = this.#data
        let nodeData = listData.first

        listData.first = null
        listData.last = null
        listData.length = 0

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
     * Therefore start or end can be the higher index, (List instance).splice(start, end, ...)
     * and (List instance).splice(end, start, ...) are the same operation.
     * @param start The position that along with end determines the range of nodes to move.
     * @param end The position that along with start determines the range of nodes to move.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start or end can not be converted to a number
     * @throws { RangeError } if start or end is not greater than or equal to 0 and less than this.length
     */
    splice (start: number, end: number): List<T>

    /**
     * Move one or more consecutive nodes from this list then insert them back into this or into another list.
     * The range is defined by Math.min(start, end) to Math.max(start, end).
     * Therefore start or end can be the higher index, (List instance).splice(start, end, ...)
     * and (List instance).splice(end, start, ...) are the same operation.
     * @param start The position that along with end determines the range of nodes to move. (defualt 0)
     * @param end The position that along with start determines the range of nodes to move. (defualt 0)
     * @param target The position in list where the nodes will be inserted. (defualt 0)
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if start or end is not greater than or equal to 0 and less than this.length
     * @throws { TypeError } if list is not a List instance
     * @throws { RangeError } if list.length would exceed List.maxLength (16777216)
     * @throws { TypeError } if target can not be converted to a number
     * @throws { RangeError } if target is not greater than or equal to 0
     * and less than list.length (minus number of nodes to be moved if list === this) + 1
     */
    splice (start: number, end: number, list: List<T>, target: number): List<T>

    splice (start = 0, end = 0, list?: List<T>, target = 0) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const currentListData = this.#data

        // start = Number.isNaN() ? start = 0 : start = Math.floor(Number(start))
        start >>= 0

        if (start < 0 || start > currentListData.length - 1)
            throw new RangeError(`start argument (${start}) is not greater than or equal to 0 and less than this.length ${currentListData.length}`)

        // end = Number.isNaN() ? end = 0 : end = Math.floor(Number(end))
        end >>= 0

        if (end < 0 || end > currentListData.length - 1)
            throw new RangeError(`end argument (${end}) is not greater than or equal to 0 and less than this.length ${currentListData.length}`)

        const rangeLength = Math.abs(start - end) + 1
        let targetListData: ListData<T>

        if (list !== undefined) {
            try { this.#data } catch (error) {
                throw new TypeError(`list argument (${Object.prototype.toString.call(list)}) is not a List instance`)
            }

            targetListData = list.#data

            if (targetListData.length + rangeLength > List.maxLength)
                throw new RangeError(`list.length (${targetListData.length}) would be greater than List.maxLength (16777216)`)

            const resultLength = currentListData === targetListData ? targetListData.length - rangeLength : targetListData.length

            // target = Number.isNaN() ? target = 0 : target = Math.floor(Number(target))
            target >>= 0

            if (target < 0 || target > resultLength)
                throw new RangeError(`target argument (${target}) is not greater than or equal to 0 and less than or equal to list.length minus number of nodes to be moved if list === this (${resultLength})`)
        } else {
            list = new List
            targetListData = list.#data
        }

        // start = Math.min(start, end); end = Math.max(start, end)
        if (end < start) {
            const _end = end

            end = start
            start = _end
        }

        // direction to iterate is based on whether the range of start to end is closer to the first or last node
        let startNodeData: ListNodeData<T> = null as any
        let endNodeData: ListNodeData<T> = null as any
        let currentNodeData: ListNodeData<T>| null = null
        let previous: ListNodeData<T> | null = null
        let next: ListNodeData<T> | null = null
        let i: number

        if (start < currentListData.length - end - 1) {
            currentNodeData = currentListData.first as ListNodeData<T>
            i = 0

            while (currentNodeData) {
                if (i >= start && i <= end) {
                    currentNodeData.listData = targetListData

                    if (i === start) {
                        startNodeData = currentNodeData
    
                        if (currentNodeData.previous) {
                            previous = currentNodeData.previous
                        }
    
                        currentNodeData.previous = null
                    }

                    if (i === end) {
                        endNodeData = currentNodeData
    
                        if (currentNodeData.next) {
                            next = currentNodeData.next
                        }
    
                        currentNodeData.next = null

                        break
                    }
                }
    
                currentNodeData = currentNodeData.next
                i++
            }
        } else {
            currentNodeData = currentListData.last as ListNodeData<T>
            i = currentListData.length - 1

            while (currentNodeData) {
                if (i >= start && i <= end) {
                    currentNodeData.listData = targetListData

                    if (i === end) {
                        endNodeData = currentNodeData
    
                        if (currentNodeData.next) {
                            next = currentNodeData.next
                        }
    
                        currentNodeData.next = null
                    }

                    if (i === start) {
                        startNodeData = currentNodeData
    
                        if (currentNodeData.previous) {
                            previous = currentNodeData.previous
                        }
    
                        currentNodeData.previous = null

                        break
                    }
                }
    
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

        // empty list
        if (targetListData.length === 0) {
            targetListData.first = startNodeData
            targetListData.last = endNodeData
            targetListData.length += rangeLength

            return targetListData.list
        }

        let targetNodeData: ListNodeData<T> = null as any
        let append = false

        // first node
        if (target === 0)
            targetNodeData = targetListData.first
        // last node
        else if (target >= targetListData.length - 1) {
            targetNodeData = targetListData.last

            // push
            if (target === targetListData.length) append = true
        } // get target node; O (n / 2)
        else {
            // forwards; Math.floor(list.length / 2)
            if (target <= (targetListData.length) >>> 1) {
                // skip first node
                currentNodeData = targetListData.first
                i = 0

                while (currentNodeData) {
                    if (i === target) {
                        targetNodeData = currentNodeData

                        break
                    }

                    currentNodeData = currentNodeData.next
                    i++
                }
            } // backwards
            else {
                // skip last node
                currentNodeData = targetListData.last
                i = targetListData.length - 1

                while (currentNodeData) {
                    if (i === target) {
                        targetNodeData = currentNodeData

                        break
                    }

                    currentNodeData = currentNodeData.previous
                    i--
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
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const listData = this.#data
        
        if (listData.length === 0)
            return this

        let nodeData: ListNodeData<T> | null = listData.first
        
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
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const listData = this.#data

        if (listData.length === 0) return this

        let nodeData = listData.first

        while (nodeData) {
            const { previous, next } = nodeData

            nodeData.previous = next
            nodeData.next = previous

            nodeData = next
        }

        const { first, last } = listData

        listData.first = last
        listData.last = first

        return this
    }

    /**
     * Copy the values of a range of nodes within this list to another range of nodes within this list.
     * The range is defined by Math.min(start, end) to Math.max(start, end).
     * Therefore start or end can be the higher index, (List instance).copyWithin(start, end, ...) and (List instance).copyWithin(end, start, ...) are the same operation.
     * @param start The position that along with end determines the range of nodes whose values will be copied. (default 0)
     * @param end The position that along with start determines the range of nodes whose values will be copied. (default 0)
     * @param target The position of the range of nodes whose values will be mutated. (default 0)
     * @param targetEnd determines whether target is the start of the range of nodes if false
     * or is the end of the range if true.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start, end or target can not be converted to a number
     * @throws { TypeError } if start, end or target is not greater than or equal to 0 and less than this.length
     */
    copyWithin (start = 0, end = 0, target = 0, targetEnd = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const listData = this.#data

        // start = Number.isNaN() ? start = 0 : start = Math.floor(Number(start))
        start >>= 0

        if (start < 0 || start > listData.length - 1)
            throw new RangeError(`start argument (${start}) is not greater than or equal to 0 and less than this.length (${listData.length})`)

        // end = Number.isNaN() ? end = 0 : end = Math.floor(Number(end))
        end >>= 0

        if (end < 0 || end > listData.length - 1)
            throw new RangeError(`end argument (${end}) is not greater than or equal to 0 and less than this.length (${listData.length})`)

        // target = Number.isNaN() ? target = 0 : target = Math.floor(Number(target))
        target >>= 0

        if (target < 0 || target > listData.length - 1)
            throw new RangeError(`target argument (${target}) is not greater than or equal to 0 and less than this.length (${listData.length})`)

        // start = Math.min(start, end); end = Math.max(start, end)
        if (end < start) {
            const _end = end

            end = start
            start = _end
        }

        targetEnd = !!targetEnd

        // skip
        if (start === target && targetEnd === false)
            return this
        else if (end === target && targetEnd === true)
            return this

        // get target node
        let currentNodeData: ListNodeData<T>
        let targetNodeData: ListNodeData<T>
        let i: number

        // first node
        if (target === 0)
            targetNodeData = listData.first
        // last node
        else if (target === listData.length - 1) 
            targetNodeData = listData.last
        // get target node; O (n / 2)
        else {
            // forwards; Math.floor(this.length / 2)
            if (target < listData.length >>> 1) {
                // skip first node
                currentNodeData = listData.first.next
                i = 1

                while (currentNodeData) {
                    if (i === target) {
                        targetNodeData = currentNodeData

                        break
                    }

                    currentNodeData = currentNodeData.next
                    i++
                }
            } // backwards
            else {
                // skip last node
                currentNodeData = listData.last.previous
                i = listData.length - 2

                while (currentNodeData) {
                    if (i === target) {
                        targetNodeData = currentNodeData

                        break
                    }

                    currentNodeData = currentNodeData.previous
                    i--
                }
            }
        }

        // copy start to end values to array; otherwise if target is within start to end then values will be erroneously duplicated; O (n / 2)
        const values = []
        const range = end - start + 1

        // forward
        if (start < listData.length - end - 1) {
            currentNodeData = listData.first as ListNodeData<T>
            i = 0

            while (currentNodeData) {
                if (i >= start && i <= end) {
                    values.push(currentNodeData.node.value)

                    if (values.length === range) break
                }

                currentNodeData = currentNodeData.next
                i++
            }
        // backwards
        } else {
            currentNodeData = listData.last as ListNodeData<T>
            i = listData.length - 1

            while (currentNodeData) {
                if (i >= start && i <= end) {
                    values.unshift(currentNodeData.node.value)

                    if (values.length === range) break
                }

                currentNodeData = currentNodeData.previous
                i--
            }
        }

        // copy
        if (targetEnd === true)
            i = values.length - 1
        else
            i = 0

        while (targetNodeData) {
            targetNodeData.node.value = values[i]

            if (targetEnd) {
                targetNodeData = targetNodeData.previous
                i--
            } else {
                targetNodeData = targetNodeData.next
                i++
            }

            if (i < 0 || i > values.length - 1) break
        }

        return this
    }

    /**
     * Sort the values of this list where the order is determined by the callback.
     * @param callback A function that determines the order of the nodes.
     * The function is called with the following arguments:
     *
     * a: The first node for comparison. Will never be undefined.
     *
     * b: The first node for comparison. Will never be undefined.
     *
     * It should return a number where: A negative value indicates that a should come before b.
     * A positive value indicates that a should come after b.
     * Zero or NaN indicates that a and b are considered equal.
     * [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#comparefn)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     */
    sort (callback: (a: ListNode<T>, b: ListNode<T>) => number) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        if (typeof callback !== 'function') throw new TypeError(`callback (${typeof callback} is not a function)`)

        const listData = this.#data

        if (listData.length <= 1) return this

        let currentNodeData = listData.first.next

        while (currentNodeData) {
            const nextNodeData = currentNodeData.next

            while (currentNodeData.previous !== null && callback(currentNodeData.previous.node, currentNodeData.node) > 0) {
                const previousPreviousNodeData = currentNodeData.previous.previous
                const previousNodeData = currentNodeData.previous
                const nextNodeData = currentNodeData.next

                if (listData.first === previousNodeData)
                    listData.first = currentNodeData
                if (listData.last === currentNodeData)
                    listData.last = previousNodeData

                if (previousPreviousNodeData !== null) previousPreviousNodeData.next = currentNodeData
                currentNodeData.previous = previousPreviousNodeData
                currentNodeData.next = previousNodeData
                previousNodeData.previous = currentNodeData
                previousNodeData.next = nextNodeData
                if (nextNodeData !== null) nextNodeData.previous = previousNodeData
            }

            currentNodeData = nextNodeData
        }

        return this
    }

    /**
     * Concatenate all nested lists into this recursively up to the specified depth.
     * @param depth The maximum recursion depth. (default 1)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if depth can not be converted to a number
     * @throws { RangeError } if depth is not greater than 0
     * @throws { RangeError } if this.length would exceed List.maxLength (16777216)
     */
    flat (depth = 1) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        // depth = Number.isNaN() ? depth = 0 : depth = Math.floor(Number(depth))
        depth >>= 0

        if (depth < 1)
            throw new RangeError(`depth argument (${depth}) is not greater than 0`)

        let i = 0
        const stack = []

        stack.unshift({ nodeData: this.#data.first })

        // calculate the resulting length and throw if it exceeds List.maxLength
        callStack: while (stack.length > 0) {
            const data = stack[0] as { nodeData: ListNodeData<T> }
            let { nodeData } = data

            while (nodeData) {
                data.nodeData = nodeData.next

                if (nodeData.node.value instanceof List && stack.length <= depth) {
                    stack.unshift({ nodeData: nodeData.node.value.#data.first })

                    continue callStack
                } else {
                    if (++i > List.maxLength) throw new RangeError(`this.length (${i}) would exceed List.maxLength (16777216)`)
                }
    
                nodeData = data.nodeData
            }

            stack.shift()
        }

        stack.unshift({ nodeData: this.#data.first })

        // flat
        callStack: while (stack.length > 0) {
            let { nodeData } = stack[0] as { nodeData: ListNodeData<T> }

            while (nodeData) {
                // if the current node value is a List instance then pause current iteration and start iterating that list; depth++
                if (nodeData.node.value instanceof List && stack.length <= depth) {
                    stack.unshift({ nodeData: nodeData.node.value.#data.first })

                    continue callStack
                } // nested list
                else if (stack.length > 1) {
                    // if the current node of this is a List instance then mutate the value
                    if (stack[stack.length - 1].nodeData.node.value instanceof List) {
                        stack[stack.length - 1].nodeData.node.value = nodeData.node.value
                    } // append the current node of this with the value of the current list's node
                    else {
                        new ListNode(nodeData.node.value, stack[stack.length - 1].nodeData.node, true)
                        stack[stack.length - 1].nodeData = stack[stack.length - 1].nodeData.next
                    }
                }

                nodeData = stack[0].nodeData = nodeData.next
            }

            // continue iteration at the next node of the previous list; depth--
            stack.shift()
            if (stack.length > 0) stack[0].nodeData = stack[0].nodeData.next
        }

        return this
    }

    /**
     * Return a copy of a portion of this list.
     * The range is defined by Math.min(start, end) to Math.max(start, end).
     * Therefore start or end can be the higher index, (List instance).slice(start, end) and (List instance).slice(end, start) are the same operation.
     * @param start default 0
     * @param end default this.length - 1
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start or end can not be converted to a number
     * @throws { RangeError } if start or end is not greater than or equal to 0 and less than this.length
     */
    slice (start = 0, end = this.#data.length - 1) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const currentListData = this.#data

        // start = Number.isNaN() ? start = 0 : start = Math.floor(Number(start))
        start >>= 0

        if (start < 0 || start > currentListData.length - 1)
            throw new RangeError(`start argument (${start}) is not greater than or equal to 0 and less than this.length (${currentListData.length})`)

        // end = Number.isNaN() ? end = 0 : end = Math.floor(Number(end))
        end >>= 0

        if (end < 0 || end > currentListData.length - 1)
            throw new RangeError(`end argument (${end}) is not greater than or equal to 0 and less than this.length (${currentListData.length})`)

        new List

        // start = Math.min(start, end); end = Math.max(start, end)
        if (end < start) {
            const _end = end

            end = start
            start = _end
        }

        // direction to iterate is based on whether the range of start to end is closer to the first or last node
        let currentNodeData: ListNodeData<T>| null = null
        let i: number

        if (start < currentListData.length - end - 1) {
            currentNodeData = currentListData.first
            i = 0

            while (currentNodeData) {
                if (i >= start && i <= end) {
                    new ListNode(currentNodeData.node.value)

                    privateListData.first = privateListData.last = privateListNodeData
                    privateListData.length = 1
                    privateListNodeData.listData = privateListData

                    currentNodeData = currentNodeData.next
                    i++

                    break
                }

                currentNodeData = currentNodeData.next
                i++
            }

            while (currentNodeData) {
                if (i >= start && i <= end) {
                    new ListNode(currentNodeData.node.value, privateListNodeData.node, true)

                    if (i === end) break
                }

                currentNodeData = currentNodeData.next
                i++
            }
        } else {
            currentNodeData = currentListData.last
            i = currentListData.length - 1

            while (currentNodeData) {
                if (i >= start && i <= end) {
                    new ListNode(currentNodeData.node.value)

                    privateListData.first = privateListData.last = privateListNodeData
                    privateListData.length = 1
                    privateListNodeData.listData = privateListData

                    currentNodeData = currentNodeData.previous
                    i--

                    break
                }

                currentNodeData = currentNodeData.previous
                i--
            }

            while (currentNodeData) {
                if (i >= start && i <= end) {
                    new ListNode(currentNodeData.node.value, privateListNodeData.node)

                    if (i === start) break
                }

                currentNodeData = currentNodeData.previous
                i--
            }
        }

        return privateListData.list as List<T>
    }

    /**
     * Return true if the value is contained in this list or false if not.
     * @param value The value to search for.
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     */
    includes (value: T, backwards = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const currentListData = this.#data

        // empty
        if (currentListData.length === 0)
            return false

        let nodeData: ListNodeData<T> | null = null
        let i: number

        if (!!backwards === true) {
            nodeData = currentListData.last
            i = currentListData.length - 1

            while (nodeData) {
                if (nodeData.node.value === value) return true

                nodeData = nodeData.previous
                i--
            }
        } else {
            nodeData = currentListData.first
            i = 0

            while (nodeData) {
                if (nodeData.node.value === value) return true

                nodeData = nodeData.next
                i++
            }
        }

        return false
    }

    /**
     * Return the index of the first node encountered upon iterating this list that contains the given value or -1 if the value is not in the list.
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     */
    indexOf (value: T, backwards = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const currentListData = this.#data

        if (currentListData.length === 0)
            return -1

        let nodeData: ListNodeData<T> | null = null
        let i: number

        if (!!backwards === true) {
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
     * @param callback A function to execute for each node in the list.
     * It should return a truthy value to indicate a matching node has been found, and a falsy value otherwise.
     * The function is called with the following arguments:
     * 
     * node: The current node being processed in the list.
     * 
     * index: The index of the current node being processed in the list.
     * 
     * list: The list find() was called upon.
     * [Array.prototype.find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find#callbackfn)
     * @param self The value to use as this when executing the callback. (default null)
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     */
    find (callback: (node: ListNode<T>, index: number, list: List<T>) => void, self = null, backwards = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        if (typeof callback !== 'function') throw new TypeError(`callback argument (${typeof callback}) is not a function`)

        const currentListData = this.#data

        if (currentListData.length === 0)
            return null

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (!!backwards === true) {
            nodeData = currentListData.last
            index = currentListData.length - 1

            while (nodeData) {
                if (!!callback.call(self, nodeData.node, index, this) === true) return nodeData.node
    
                nodeData = nodeData.previous
                index--
            }
        } else {
            nodeData = currentListData.first
            index = 0

            while (nodeData) {
                if (callback.call(self, nodeData.node, index, this) === true) return nodeData.node
    
                nodeData = nodeData.next
                index++
            }
        }

        return null
    }

    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return the index of the first node encountered where the callback returns true.
     * @param callback A function to execute for each node in the list.
     * It should return a truthy value to indicate a matching node has been found, and a falsy value otherwise.
     * The function is called with the following arguments:
     * 
     * node: The current node being processed in the list.
     * 
     * index: The index of the current node being processed in the list.
     * 
     * list: The list findIndex() was called upon. [Array.prototype.findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex#callbackfn)
     * @param self The value to use as this when executing the callback. (default null)
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     */
    findIndex (callback: (node: ListNode<T>, index: number, list: List<T>) => void, self = null, backwards = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        if (typeof callback !== 'function') throw new TypeError(`callback argument (${typeof callback}) is not a function`)

        const currentListData = this.#data

        if (currentListData.length === 0)
            return -1

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (!!backwards === true) {
            nodeData = currentListData.last
            index = currentListData.length - 1

            while (nodeData) {
                if (!!callback.call(self, nodeData.node, index, this) === true)
                    return index

                nodeData = nodeData.previous
                index--
            }
        } else {
            nodeData = currentListData.first
            index = 0

            while (nodeData) {
                if (!!callback.call(self, nodeData.node, index, this) === true)
                    return index

                nodeData = nodeData.next
                index++
            }
        }

        return -1
    }

    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return true when the callback returns true or return false.
     * @param callback A function to execute for each node in the list.
     * It should return a truthy value to indicate the node passes the test, and a falsy value otherwise.
     * The function is called with the following arguments:
     *
     * node: The current node being processed in the list.
     *
     * index: The index of the current node being processed in the list.
     *
     * list: The list some() was called upon. [Array.prototype.some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some#callbackfn)
     * @param self The value to use as this when executing the callback. (default null)
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     */
    some (callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self = null, backwards = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        if (typeof callback !== 'function') throw new TypeError(`callback argument (${typeof callback}) is not a function`)

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return false

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (!!backwards === true) {
            nodeData = currentListData.last
            index = currentListData.length - 1

            while (nodeData) {
                if (!!callback.call(self, nodeData.node, index, this) === true)
                    return true

                nodeData = nodeData.previous
                index--
            }
        } else {
            nodeData = currentListData.first
            index = 0

            while (nodeData) {
                if (!!callback.call(self, nodeData.node, index, this) === true)
                    return true

                nodeData = nodeData.next
                index++
            }
        }

        return false
    }

    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return false when the callback does not return true or return true.
     * @param callback A function to execute for each node in the list.
     * It should return a truthy value to indicate the node passes the test, and a falsy value otherwise.
     * The function is called with the following arguments:
     *
     * node: The current node being processed in the list.
     *
     * index: The index of the current node being processed in the list.
     *
     * list: The list every() was called upon. [Array.prototype.every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every#callbackfn)
     * @param self The value to use as this when executing the callback. (default null)
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     */
    every (callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self = null, backwards = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        if (typeof callback !== 'function') throw new TypeError(`callback argument (${typeof callback}) is not a function`)

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return false

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (!!backwards === true) {
            nodeData = currentListData.last
            index = currentListData.length - 1

            while (nodeData) {
                if (!!callback.call(self, nodeData.node, index, this) !== true) return false

                nodeData = nodeData.previous
                index--
            }
        } else {
            nodeData = currentListData.first
            index = 0

            while (nodeData) {
                if (!!callback.call(self, nodeData.node, index, this) !== true) return false

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
     * @param callback A function to execute for each node in the list.
     * Its return value becomes the value of the accumulator parameter on the next invocation of callback.
     * For the last invocation, the return value becomes the return value of reduce().
     * The function is called with the following arguments:
     * 
     * accumulator: The value resulting from the previous call to callback. On the first call, its value is initialValue.
     *
     * node: The current node.
     *
     * index: The position of node in the list.
     *
     * list: The list reduce() was called upon. [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#callbackfn)
     * @param initialValue The value of accumulator for the initial call to the callback.
     * @param self The value to use as this when executing the callback. (default null)
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     */
    reduce<U> (callback: (accumulator: U, node: ListNode<T>, index: number, list: List<T>) => U, initialValue: U, self = null, backwards = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        if (typeof callback !== 'function') throw new TypeError(`callback argument (${typeof callback}) is not a function`)

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return initialValue

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (!!backwards === true) {
            nodeData = currentListData.last
            index = currentListData.length - 1

            while (nodeData) {
                initialValue = callback.call(self, initialValue, nodeData.node, index, this)

                nodeData = nodeData.previous
                index--
            }
        } else {
            nodeData = currentListData.first
            index = 0

            while (nodeData) {
                initialValue = callback.call(self, initialValue, nodeData.node, index, this)

                nodeData = nodeData.next
                index++
            }
        }

        return initialValue
    }

    /**
     * Iterate this list and call the given callback once for each node and remove the nodes where the callback returned true.
     * @param callback A function to execute for each node in the list.
     * It should return a truthy value to keep the node in the resulting list, and a falsy value otherwise.
     * The function is called with the following arguments:
     *
     * node: The current node being processed in the list.
     *
     * index: The index of the current node being processed in the list.
     *
     * list: The list filter() was called upon. [Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#callbackfn)
     * @param self The value to use as this when executing the callback. (default null)
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     */
    filter (callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self = null, backwards = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        if (typeof callback !== 'function') throw new TypeError(`callback argument (${typeof callback}) is not a function`)

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return this

        const nodeDataArray = []
        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (!!backwards === true) {
            nodeData = currentListData.last
            index = currentListData.length - 1
            
            while (nodeData) {
                if (!!callback.call(self, nodeData.node, index, this) === true) nodeDataArray.push(nodeData)
                
                nodeData = nodeData.previous
                index--
            }
        } else {
            nodeData = currentListData.first
            index = 0

            while (nodeData) {
                if (!!callback.call(self, nodeData.node, index, this) === true) nodeDataArray.push(nodeData)
                
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
     * @param callback A function to execute for each node in the list.
     * Its return value is added as a single node in the new list. The function is called with the following arguments:
     *
     * node: The current node being processed in the list.
     *
     * index: The index of the current node being processed in the list.
     *
     * list: The list map() was called upon. [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#callbackfn)
     * @param self The value to use as this when executing the callback. (default null)
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     */
    map <U>(callback: (node: ListNode<T>, index: number, list: List<T>) => U, self = null, backwards = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        if (typeof callback !== 'function') throw new TypeError(`callback argument (${typeof callback}) is not a function`)

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return this

        const values = []
        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (!!backwards === true) {
            nodeData = currentListData.last
            index = currentListData.length - 1

            while (nodeData) {
                values.push(callback.call(self, nodeData.node, index, this))

                nodeData = nodeData.previous
                index--
            }
        } else {
            nodeData = currentListData.first
            index = 0

            while (nodeData) {
                values.push(callback.call(self, nodeData.node, index, this))

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
     * @param callback A function to execute for each node in the list. Its return value is discarded.
     * The function is called with the following arguments:
     *
     * node: The current node being processed in the list.
     *
     * index: The index of the current node being processed in the list.
     *
     * list: The list forEach() was called upon.
     * @param self The value to use as this when executing the callback. (default null)
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if callback is not a function
     */
    forEach (callback: (node: ListNode<T>, index: number, list: List<T>) => void, self = null, backwards = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        if (typeof callback !== 'function') throw new TypeError(`callback argument (${typeof callback}) is not a function`)

        const currentListData = this.#data
        
        if (currentListData.length === 0)
            return this

        let nodeData: ListNodeData<T> | null = null
        let index: number

        if (!!backwards === true) {
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
     * @throws { RangeError } if the new list length would exceed List.maxLength (16777216)
     */
    concat (...values: (T | List<T>)[]) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }
        
        let length = this.#data.length

        if (length + values.length === 0)
            return new List<T>
        else if (length + values.length > List.maxLength)
            throw new RangeError(`the new list length (${length + values.length}) would exceed List.maxLength (16777216)`)

        for (const value of values) {
            if (value instanceof List) {
                length += value.#data.length
            } else
                length++
        }

        if (length > List.maxLength) throw new RangeError(`the new list length (${length}) would exceed List.maxLength (16777216)`)

        let nodeData: ListNodeData<T> | null = null

        privateListData = null
        privateListNodeData = null

        if (this.#data.length > 0) {
            nodeData = this.#data.first
            new ListNode(nodeData.node.value)

            nodeData = nodeData.next

            while (nodeData) {
                new ListNode(nodeData.node.value, privateListNodeData.node, true)
    
                nodeData = nodeData.next
            }
        }
        
        if (values.length > 0) {
            let value = values[0]

            if (value instanceof List && value.#data.length > 0) {
                nodeData = value.#data.first
                new ListNode(nodeData.node.value, privateListNodeData?.node, true)

                nodeData = nodeData.next

                while (nodeData) {
                    new ListNode(nodeData.node.value, privateListNodeData.node, true)

                    nodeData = nodeData.next
                }
            } else
                new ListNode(value, privateListNodeData?.node, true)

            for (let i = 1; i < values.length; i++) {
                value = values[i]
    
                if (value instanceof List) {
                    nodeData = value.#data.first
    
                    while (nodeData) {
                        new ListNode(nodeData.node.value, privateListNodeData.node, true)
    
                        nodeData = nodeData.next
                    }
                } else
                    new ListNode(value, privateListNodeData.node, true)
            }
        }

        if (privateListData === null) {
            new List()
            privateListData.first = privateListData.last = privateListNodeData
            privateListData.length = 1
            privateListNodeData.listData = privateListData
        }

        return privateListData.list
    }

    /**
     * Return an array containing each node in this list.
     * @throws { TypeError } if this is not a List instance
     */
    nodes () {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

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
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

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
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const currentListData = this.#data
        let listString = ''
        
        if (currentListData.length === 0)
            return listString

        let value = currentListData.first.node.value

        listString += typeof value === 'object' ? Object.prototype.toString.call(value) : value

        let nodeData = currentListData.first.next
        let index = 1

        while (nodeData) {
            value = nodeData.node.value

            listString += ',' + (typeof value === 'object' ? Object.prototype.toString.call(value) : value)

            nodeData = nodeData.next
            index++
        }

        return listString
    }

    /**
     * Return an iterator representng this list.
     * @throws { TypeError } if this is not a List instance
     */
    [Symbol.iterator] (): ListIterator<ListNode<T>> {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

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

// make class properties read only and non-enumerable if the key is a symbol
Object.defineProperty(ListNode, Symbol.hasInstance, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: ListNode[Symbol.hasInstance]
})

Object.defineProperty(List, 'maxLength', {
    configurable: false,
    writable: false,
    enumerable: true,
    value: List.maxLength
})

Object.defineProperty(List, Symbol.hasInstance, {
    configurable: false,
    writable: false,
    enumerable: false,
    value: List[Symbol.hasInstance]
});

let propertyNames = Object.getOwnPropertyNames(ListNode.prototype) as (string | symbol)[]
propertyNames.push(...Object.getOwnPropertySymbols(ListNode.prototype))

propertyNames.forEach(name => {
    const descriptor = Object.getOwnPropertyDescriptor(ListNode.prototype, name)
    descriptor.configurable = false
    descriptor.enumerable = typeof name === 'string' ? true : false

    if (!descriptor.get && !descriptor.set) descriptor.writable = false

    Object.defineProperty(ListNode.prototype, name, descriptor)
})

propertyNames = Object.getOwnPropertyNames(List.prototype) as (string | symbol)[]
propertyNames.push(...Object.getOwnPropertySymbols(List.prototype))

propertyNames.forEach(name => {
    const descriptor = Object.getOwnPropertyDescriptor(List.prototype, name)
    descriptor.configurable = false
    descriptor.enumerable = typeof name === 'string' ? true : false

    if (!descriptor.get && !descriptor.set) descriptor.writable = false

    Object.defineProperty(List.prototype, name, descriptor)
})