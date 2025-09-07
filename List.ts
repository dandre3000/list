/** ListNode instance #data property */
type ListNodeData<T> = {
    node: ListNode<T>
    listData: ListData<T> | null
    previous: ListNodeData<T> | null
    next: ListNodeData<T> | null
}

let newListNodeData: ListNodeData<any>

/** All #data property objects are stored here. */
const privateDataMap: WeakMap<ListNode<any> | List<any>, ListNodeData<any> | ListData<any>> = new Map

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
    constructor (value: T)

    /**
     * Create a ListNode instance and append or prepend it to another node.
     * @param value The value this node will contain.
     * @param node The node that will be appended or prepended with this.
     * @param append If the append argument is truthy then append this to node else prepend this to node. (default false)
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { RangeError } if node.list().length() would exceed List.maxLength
     */
    constructor (value: T, node: ListNode<T>, append?)

    constructor (value: T, node?: ListNode<T>, append = false) {
        let targetNodeData: ListNodeData<T>
        let targetListData: ListData<T> | null = null

        if (node !== undefined) {
            try { targetNodeData = node.#data } catch (error) {
                throw new TypeError(`node argument (${Object.prototype.toString.call(node)}) is not a ListNode instance`)
            }

            targetListData = targetNodeData.listData

            if (targetListData !== null && targetListData.length >= List.maxLength)
                throw new RangeError(`node.list().length() (${targetListData.length}) would exceed List.maxLength (16777216)`)
        }

        const currentNodeData: ListNodeData<T> = newListNodeData = this.#data = {
            node: this,
            listData: targetListData,
            previous: null,
            next: null
        }

        this.value = value

        if (!targetNodeData) return

        if (!targetListData) {
            targetNodeData.listData = targetListData = privateDataMap.get(new List) as ListData<T>
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
     * Return the list containing this node or null if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    list (): List<T> | null {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }

        return this.#data.listData ? this.#data.listData.list : null
    }

    /**
     * Return the previous node in the list containing this node.
     * Return null if this is the first node in the list or if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    previous (): ListNode<T> | null {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }

        return this.#data.previous ? this.#data.previous.node : null
    }

    /**
     * Return the next node in the list containing this node.
     * Return null if this is the last node in the list or if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    next (): ListNode<T> | null {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }

        return this.#data.next ? this.#data.next.node : null
    }

    /**
     * Remove this node from its containing list and prepend it to another node.
     * @param node The node that will be prepended with this.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { ReferenceError } if node === this
     * @throws { RangeError } if node.list().length() would exceed List.maxLength (16777216)
     */
    prependTo (node: ListNode<T>) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }

        const currentNodeData = this.#data
        let targetNodeData: ListNodeData<T>

        try { targetNodeData = node.#data } catch (error) {
            throw new TypeError(`node argument (${Object.prototype.toString.call(node)}) is not a ListNode instance`)
        }

        let targetListData = targetNodeData.listData

        if (targetListData) {
            if (targetListData.length >= List.maxLength)
                throw new RangeError(`node.list().length() (${targetListData.length}) would exceed List.maxLength (16777216)`)

            // already prepended to node
            if (currentNodeData === targetNodeData.previous) return this

            targetListData.length++
        } // create new list if node is not in one
        else {
            new List
            targetNodeData.listData = targetListData = newListData
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

        // prepend node
        currentNodeData.listData = targetListData

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
        let targetNodeData: ListNodeData<T>

        try { targetNodeData = node.#data } catch (error) {
            throw new TypeError(`node argument (${Object.prototype.toString.call(node)}) is not a ListNode instance`)
        }

        let targetListData = targetNodeData.listData

        if (targetListData) {
            if (targetListData.length >= List.maxLength)
                throw new RangeError(`node.list().length() (${targetListData.length}) would exceed List.maxLength (16777216)`)

            // already appended to node
            if (currentNodeData === targetNodeData.next) return this

            targetListData.length++
        } // create new list if node is not in one
        else {
            new List
            targetNodeData.listData = targetListData = newListData
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
     * Remove this node from its containing list and insert it into another list.
     * @param list The list that will contain this node.
     * @param index The position in the list that this node will occupy. (default 0)
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if list is not a List instance
     * @throws { RangeError } if list length would exceed List.maxLength (16777216)
     * @throws { RangeError } if index is not an integer greater than -1 and less than list.length() + 1
     */
    insertInto (list: List<T>, index = 0) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a ListNode instance`)
        }

        if (!(list instanceof List)) throw new TypeError(`list argument (${list}) is not a List instance`)

        const targetListData = privateDataMap.get(list) as ListData<T>

        if (targetListData.length >= List.maxLength)
            throw new RangeError(`list.length() (${targetListData.length}) + 1 would exceed List.maxLength (16777216)`)

        index = Number(index)

        if (!Number.isInteger(index))
            throw new RangeError(`index argument (${index}) is not an integer`)
        else if (index < 0)
            throw new RangeError(`index argument (${index}) is less than 0`)
        else if (index > targetListData.length)
            throw new RangeError(`index argument (${index}) is greater than list.length()`)

        let currentNodeData = this.#data
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
        } // first node; list length >= 1
        else if (index === 0) {
            targetNodeData = targetListData.first
        } // last node; list length >= 2
        else if (index >= targetListData.length - 1) {
            // prepend
            targetNodeData = targetListData.last

            // append
            if (index === targetListData.length) append = true
        // get target node; list length >= 3; O (n / 2)
        } else {
            let i: number

            // forwards
            if (index < targetListData.length / 2) {
                // skip first node
                targetNodeData = (targetListData.first as ListNodeData<T>).next
                i = 1

                while (targetNodeData) {
                    if (index === i) break
    
                    targetNodeData = targetNodeData.next
                    i++
                }
            } // backwards
            else {
                // skip last node
                targetNodeData = (targetListData.last as ListNodeData<T>).previous
                i = targetListData.length - 2

                while (targetNodeData) {
                    if (index === i) break
    
                    targetNodeData = targetNodeData.previous
                    i--
                }
            }
        }

        targetListData.length++

        if (append) {
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

        return this
    }

    /**
     * Remove this node from its current list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    remove() {
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

let newListData: ListData<any>

/** Doubly linked list */
export class List<T> implements Iterable<ListNode<T>> {
    /** The maximum length of all lists. */
    static readonly maxLength = 2 ** 24 // 16777216

    static [Symbol.hasInstance] (instance) {
        try { instance.#data } catch (error) { return false }

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
        const listData = newListData = this.#data = {
            list: this,
            first: null,
            last: null,
            length: 0
        }

        privateDataMap.set(this, listData)

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

                newListNodeData.listData = listData
                listData.first = listData.last = newListNodeData
                listData.length = 1
            }

            for (let i = 1; i < length; i++) {
                new ListNode(undefined, newListNodeData.node, true)
            }
        } // fill with values
        else {
            if (values.length > 0) {
                new ListNode(values[0])

                newListNodeData.listData = listData
                listData.first = listData.last = newListNodeData
                listData.length = 1
            }

            for (let i = 1; i < values.length; i++) {
                new ListNode(values[i], newListNodeData.node, true)
            }
        }
    }

    /**
     * Return the first node in this list or null if it is empty.
     * @throws { TypeError } if this is not a List instance
     */
    first () {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        return (this.#data.first ? this.#data.first.node : null)
    }

    /**
     * Return the last node in this list or null if it is empty.
     * @throws { TypeError } if this is not a List instance
     */
    last () {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        return this.#data.last ? this.#data.last.node : null
    }

    /**
     * Return the node at the given index or null if index is out of bounds.
     * @param index The position of the node.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if index is not an integer greater than -1 and less than this.length() - 1
     */
    at (index: number): ListNode<T> | null {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const listData = this.#data

        index = Number(index)

        if (!Number.isInteger(index))
            throw new RangeError(`index argument (${index}) is not an integer`)
        else if (index < 0 || index > listData.length - 1)
            return null

        let nodeData: ListNodeData<T> | null

        // first; length >= 1
        if (index === 0)
            nodeData = listData.first
        // last; length >= 2
        else if (index === listData.length - 1)
            nodeData = listData.last
        // get node; length >= 3
        else {
            let i: number

            // only search half the list
            if (index < (listData.length) / 2) {
                // skip first node
                nodeData = (listData.first as ListNodeData<T>).next
                i = 1

                while (nodeData) {
                    if (index === i) break
            
                    nodeData = nodeData.next
                    i++
                }
            } else {
                // skip last node
                nodeData = (listData.last as ListNodeData<T>).previous
                i = listData.length - 2

                while (nodeData) {
                    if (index === i) break
            
                    nodeData = nodeData.previous
                    i--
                }
            }
        }
    
        return (nodeData as ListNodeData<T>).node
    }

    /**
     * Return the length of this list.
     * @throws { TypeError } if this is not a List instance
     */
    length () {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        return this.#data.length
    }

    /**
     * Insert the values to the front of this list and return this length.
     * @param values The values to be inserted.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if list.length() would exceed List.maxLength (16777216)
     */
    unshift (...values: T[]) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        let listData = this.#data

        if (listData.length + values.length > List.maxLength)
            throw new RangeError(`this().length() (${listData.length}) would exceed List.maxLength (16777216)`)

        if (values.length > 0) {
            let i = values.length - 1

            if (listData.length === 0) {
                new ListNode(values[i])
                newListNodeData.listData = listData

                listData.first = listData.last = newListNodeData
                listData.length = 1

                i--
            }

            for (i; i > -1; i--) {
                new ListNode(values[i], listData.first.node)
            }
        }

        return this.#data.length
    }

    /**
     * Insert the values to the end of this list and return this length.
     * @param values The values to be inserted.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if list.length() would exceed List.maxLength (2 ** 24 - 1)
     */
    push (...values: T[]) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        let listData = this.#data

        if (this.#data.length + values.length > List.maxLength)
            throw new RangeError(`this().length() (${listData.length}) would exceed List.maxLength (16777216)`)

        if (values.length > 0) {
            let i = 0

            if (listData.length === 0) {
                new ListNode(values[i])
                newListNodeData.listData = listData

                listData.first = listData.last = newListNodeData
                listData.length = 1

                i = 1
            }

            for (i; i < values.length; i++) {
                new ListNode(values[i], this.#data.last.node, true)
            }
        }

        return this.#data.length
    }

    /**
     * Insert the values into this list at the given index and return this length.
     * @param index The position where values will be inserted.
     * @param values The values to be inserted.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if index is not an integer greater than -1 or less than this length + 1
     * @throws { RangeError } if list.length() would exceed List.maxLength (2 ** 24 - 1)
     */
    insert (index: number, ...values: T[]) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const listData = this.#data
        const valuesLength = values.length

        if (listData.length + valuesLength > List.maxLength)
            throw new RangeError(`this().length() (${listData.length}) would exceed List.maxLength (16777216)`)

        index = Number(index)

        if (!Number.isInteger(index))
            throw new RangeError(`index argument (${index}) is not an integer`)
        else if (index < 0)
            throw new RangeError(`index argument (${index}) is less than 0`)
        else if (index > listData.length)
            throw new RangeError(`index argument (${index}) is greater than this.length() (${listData.length})`)

        let nodeData: ListNodeData<T>
        let append = false
        let i = valuesLength - 1

        // first node; target list length >= 1
        if (index === 0) {
            if (listData.length === 0) {
                new ListNode(values[i])
                newListNodeData.listData = listData

                listData.first = listData.last = newListNodeData
                listData.length = 1

                i--
            }

            nodeData = listData.first
        }
        // last node; target list length >= 2
        else if (index >= listData.length - 1) {
            nodeData = listData.last

            if (index === listData.length) {
                append = true
                i = 0
            }
        }
        // get node; target list length >= 3; O (n / 2)
        else {
            let i: number

            // forwards
            if (index < (listData.length) / 2) {
                // skip first node
                nodeData = (listData.first as ListNodeData<T>).next
                i = 1

                while (nodeData !== null) {
                    if (index === i) break

                    nodeData = nodeData.next
                    i++
                }
            }
            // backwards
            else {
                // skip last node
                nodeData = (listData.last as ListNodeData<T>).previous
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

        index = Number(index)

        if (!Number.isInteger(index))
            throw new RangeError(`index argument (${index}) is not an integer`)
        else if (index < 0)
            throw new RangeError(`index argument (${index}) is less than 0`)
        else if (index > listData.length - 1)
            throw new RangeError(`index argument (${index}) is greater than this.length() - 1`)

        let nodeData: ListNodeData<T> | null = null

        if (index === 0)
            nodeData = listData.first
        else if (index === listData.length - 1)
            nodeData = listData.last
        else {
            let forwards: boolean
            let i: number

            // forwards
            if (index < (listData.length) / 2) {
                forwards = true
                nodeData = (listData.first as ListNodeData<T>).next as ListNodeData<T>
                i = 1
            // backwards
            } else {
                forwards = false
                nodeData = (listData.last as ListNodeData<T>).previous as ListNodeData<T>
                i = listData.length - 2
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
     * @throws { TypeError } if start or end is not an integer
     * @throws { RangeError } if start or end is less than 0 or greater than or equal to this length
     */
    splice (start: number, end: number): List<T>

    /**
     * Move one or more consecutive nodes from this list then insert them back into this or into another list.
     * The range is defined by Math.min(start, end) to Math.max(start, end).
     * Therefore start or end can be the higher index, (List instance).splice(start, end, ...)
     * and (List instance).splice(end, start, ...) are the same operation.
     * @param start The position that along with end determines the range of nodes to move.
     * @param end The position that along with start determines the range of nodes to move.
     * @param target The position in list where the nodes will be inserted.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if start or end is not an integer greater than -1 or less than this length
     * @throws { TypeError } if list is not a List instance
     * @throws { RangeError } if list.length() would exceed List.maxLength (16777216)
     * @throws { TypeError } if list is defined but target is undefined
     * @throws { RangeError } if list is defined but target is not a integer greater than -1
     * or less than list length (minus number of nodes to be moved if list === this) + 1
     */
    splice (start: number, end: number, list: List<T>, target: number): List<T>

    splice (start: number, end: number, list?: List<T>, target?: number) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const currentListData = this.#data

        start = Number(start)

        if (!Number.isInteger(start))
            throw new RangeError(`start argument (${start}) is not an integer`)
        else if (start < 0)
            throw new RangeError(`start argument (${start}) is less than 0`)
        else if (start > currentListData.length - 1)
            throw new RangeError(`start argument (${start}) is greater than this.length - 1`)

        end = Number(end)

        if (!Number.isInteger(end))
            throw new RangeError(`end argument (${end}) is not an integer`)
        else if (end < 0)
            throw new RangeError(`end argument (${end}) is less than 0`)
        else if (end > currentListData.length - 1)
            throw new RangeError(`end argument (${end}) is greater than this.length - 1`)

        const rangeLength = Math.abs(start - end) + 1
        let targetListData: ListData<T>

        if (list !== undefined) {
            try { this.#data } catch (error) {
                throw new TypeError(`list argument (${Object.prototype.toString.call(list)}) is not a List instance`)
            }

            targetListData = list.#data

            if (targetListData.length + rangeLength > List.maxLength)
                throw new RangeError(`list.length() (${targetListData.length}) would be greater than List.maxLength (16777216)`)

            if (target === undefined)
                throw new TypeError('target argument is undefined')

            target = Number(target)

            if (!Number.isInteger(target))
                throw new RangeError(`target argument (${target}) is not an integer`)
            else if (target < 0)
                throw new RangeError(`target argument (${target}) is less than 0`)
            else if (currentListData === targetListData) {
                if (target > targetListData.length - rangeLength)
                    throw new RangeError(`target argument (${target}) would be greater than this.length() (${targetListData.length - rangeLength}) after removing the specified nodes`)
            } else {
                if (target > targetListData.length)
                    throw new RangeError(`target argument (${target}) is greater than list.length()`)
            }
        } else {
            list = new List
            targetListData = list.#data
        }

        let targetNodeData: ListNodeData<T> = null as any

        // start = Math.min(start, end)
        // end = Math.max(start, end)
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

                // start
                if (i === start) {
                    startNodeData = currentNodeData

                    if (currentNodeData.previous) {
                        previous = currentNodeData.previous
                    }

                    currentNodeData.previous = null
                }

                // end
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
        } // first node; target list length >= 1
        else if (target === 0) {
            targetNodeData = targetListData.first as ListNodeData<T>
        } // last node; target list length >= 2
        else if (target >= targetListData.length - 1) {
            targetNodeData = targetListData.last as ListNodeData<T>

            if (target === targetListData.length) append = true
        } // get target node; target list length >= 3; O (n / 2)
        else {
            // get node from target
            if (!targetNodeData) {
                // forwards
                if (target < (targetListData.length) / 2) {
                    // skip first node
                    currentNodeData = (targetListData.first as ListNodeData<T>).next
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
                    currentNodeData = (targetListData.last as ListNodeData<T>).previous
                    i = targetListData.length - 2

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
     * @param start The position that along with end determines the range of nodes whose values will be copied.
     * @param end The position that along with start determines the range of nodes whose values will be copied.
     * @param target The position of the range of nodes whose values will be mutated.
     * @param targetEnd determines whether target is the start of the range of nodes if false
     * or is the end of the range if true.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start, end or target is not an integer greater than -1 and less than this.length()
     */
    copyWithin (start: number, end: number, target: number, targetEnd = false) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const currentListData = this.#data

        start = Number(start)

        if (!Number.isInteger(start) || start < 0 || start > currentListData.length - 1)
            throw new RangeError(`start argument (${start}) is not a integer greater than -1 or less than this.length() (${currentListData.length})`)

        end = Number(end)

        if (!Number.isInteger(end) || end < 0 || end > currentListData.length - 1)
            throw new RangeError(`end argument (${end}) is not a integer greater than -1 or less than this.length() (${currentListData.length})`)

        target = Number(target)

        if (!Number.isInteger(target) || target < 0 || target > currentListData.length - 1)
            throw new RangeError(`target argument (${target}) is not a integer greater than -1 or less than this.length() (${currentListData.length})`)

        // start = Math.min(start, end); end = Math.max(start, end)
        if (end < start) {
            const _end = end

            end = start
            start = _end
        }

        targetEnd = !!targetEnd

        // skip
        if (start === target && targetEnd === false) return this
        else if (end === target && targetEnd === true) return this

        // get target node
        let currentNodeData: ListNodeData<T>
        let targetNodeData: ListNodeData<T>
        let i: number

        // first node; target list length >= 1
        if (target === 0)
            targetNodeData = currentListData.first as ListNodeData<T>
        // last node; target list length >= 2
        else if (target === currentListData.length - 1) 
            targetNodeData = currentListData.last as ListNodeData<T>
        // get target node; target list length >= 3; O (n / 2)
        else {
            if (target < (currentListData.length) / 2) {
                // skip first node
                currentNodeData = (currentListData.first as ListNodeData<T>).next
                i = 1

                while (currentNodeData) {
                    if (i === target) {
                        targetNodeData = currentNodeData

                        break
                    }

                    currentNodeData = currentNodeData.next
                    i++
                }
            } else {
                // skip last node
                currentNodeData = (currentListData.last as ListNodeData<T>).previous
                i = currentListData.length - 2

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
        if (start < currentListData.length - end - 1) {
            currentNodeData = currentListData.first as ListNodeData<T>
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
            currentNodeData = currentListData.last as ListNodeData<T>
            i = currentListData.length - 1

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

        const nodes: ListNode<T>[] = []
        let nodeData: ListNodeData<T> | null = this.#data.first
        let i = 0

        while (nodeData) {
            nodes[i] = nodeData.node
            nodeData = nodeData.next
            i++
        }

        const values = nodes.sort(callback).map(({ value }) => value)

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
     * Concatenate all nested lists into this recursively up to the specified depth.
     * @param depth The maximum recursion depth. (default 1)
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if depth is not an integer greater than 0
     * @throws { RangeError } if this.length() would exceed List.maxLength (16777216)
     */
    flat (depth = 1) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        depth = Number(depth)

        if (!Number.isInteger(depth) || depth < 1)
            throw new RangeError(`depth argument (${depth}) is not an integer greater than 0`)

        let i = 0
        const stack = []

        stack.unshift({ nodeData: this.#data.first })

        callStack: while (stack.length > 0) {
            const data = stack[0] as { nodeData: ListNodeData<T> }
            let { nodeData } = data

            while (nodeData) {
                data.nodeData = nodeData.next

                if (nodeData.node.value instanceof List && stack.length <= depth) {
                    stack.unshift({ nodeData: nodeData.node.value.#data.first })

                    continue callStack
                } else {
                    if (++i > List.maxLength) throw new RangeError(`this.length() (${i}) would exceed List.maxLength (16777216)`)
                }
    
                nodeData = data.nodeData
            }

            stack.shift()
        }

        i = 0

        stack.unshift({ nodeData: this.#data.first })

        callStack: while (stack.length > 0) {
            let { nodeData } = stack[0] as { nodeData: ListNodeData<T> }

            while (nodeData) {
                if (nodeData.node.value instanceof List && stack.length <= depth) {
                    stack.unshift({ nodeData: nodeData.node.value.#data.first })

                    continue callStack
                } else if (stack.length > 1) {
                    if (stack[stack.length - 1].nodeData.node.value instanceof List) {
                        stack[stack.length - 1].nodeData.node.value = nodeData.node.value
                    } else {
                        new ListNode(nodeData.node.value, stack[stack.length - 1].nodeData.node, true)
                        stack[stack.length - 1].nodeData = stack[stack.length - 1].nodeData.next
                    }
                }

                nodeData = stack[0].nodeData = nodeData.next
            }

            stack.shift()
            if (stack.length > 0) stack[0].nodeData = stack[0].nodeData.next
            // stack[stack.length - 1].nodeData = stack[stack.length - 1].nodeData.next
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
     * @throws { RangeError } if start or end is not a integer greater than -1 and less than this.length()
     */
    slice (start = 0, end = this.#data.length - 1) {
        try { this.#data } catch (error) {
            throw new TypeError(`this (${Object.prototype.toString.call(this)}) is not a List instance`)
        }

        const currentListData = this.#data
        start = Number(start)

        if (!Number.isInteger(start) || start < 0 || start > currentListData.length - 1)
            throw new RangeError(`start argument (${start}) is not a integer greater than -1 or less than this.length() (${currentListData.length})`)

        end = Number(end)

        if (!Number.isInteger(end) || end < 0 || end > currentListData.length - 1)
            throw new RangeError(`end argument (${end}) is not a integer greater than -1 or less than this.length() (${currentListData.length})`)

        // make start the lower index
        if (end < start) {
            const _end = end

            end = start
            start = _end
        }

        // direction to iterate is based on whether the range of start to end is closer to the first or last node
        let currentNodeData: ListNodeData<T>| null = null
        let i: number

        let targetNode: ListNode<T>

        if (start < currentListData.length - end - 1) {
            currentNodeData = currentListData.first
            i = 0

            while (currentNodeData) {
                if (i >= start && i <= end) {
                    targetNode = new ListNode(currentNodeData.node.value, targetNode, true)
                }

                currentNodeData = currentNodeData.next
                i++
            }
        } else {
            currentNodeData = currentListData.last
            i = currentListData.length - 1

            while (currentNodeData) {
                if (i >= start && i <= end) {
                    targetNode = new ListNode(currentNodeData.node.value, targetNode)
                }

                currentNodeData = currentNodeData.previous
                i--
            }
        }

        if (!targetNode.list()) targetNode.insertInto(new List)

        return targetNode.list()
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
     * Its return value becomes the value of the accumulator parameter on the next invocation of callbackFn.
     * For the last invocation, the return value becomes the return value of reduce().
     * The function is called with the following arguments:
     * 
     * accumulator: The value resulting from the previous call to callbackFn. On the first call, its value is initialValue.
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

        if (length + values.length === 0) return new List<T>
        else if (length + values.length > List.maxLength)
            throw new RangeError(`the new list length (${length + values.length}) would exceed List.maxLength (16777216)`)

        for (const value of values) {
            if (value instanceof List) {
                length += value.#data.length
            } else
                length++
        }

        if (length > List.maxLength) throw new RangeError(`the new list length (${length}) would exceed List.maxLength (16777216)`)

        let targetNode: ListNode<T>
        let nodeData: ListNodeData<T> | null = null
        let value = values[0]
        let i = 0

        if (this.#data.length > 0) {
            targetNode = new ListNode(this.#data.first.node.value)
            nodeData = this.#data.first.next

            while (nodeData) {
                targetNode = new ListNode(nodeData.node.value, targetNode, true)
    
                nodeData = nodeData.next
            }
        } else {
            i++

            if (value instanceof List && value.#data.length > 0) {
                nodeData = value.#data.first
                targetNode = new ListNode(nodeData.node.value)

                nodeData = nodeData.next

                while (nodeData) {
                    targetNode = new ListNode(nodeData.node.value, targetNode, true)

                    nodeData = nodeData.next
                }
            } else
                targetNode = new ListNode(value as T)
        }

        for (i; i < values.length; i++) {
            value = values[i]

            if (value instanceof List) {
                nodeData = value.#data.first

                while (nodeData) {
                    targetNode = new ListNode(nodeData.node.value, targetNode, true)

                    nodeData = nodeData.next
                }
            } else
                targetNode = new ListNode(value, targetNode, true)
        }

        return targetNode.list()
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
    [Symbol.iterator] (): ArrayIterator<ListNode<T>> {
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
    Object.defineProperty(ListNode.prototype, name, {
        configurable: false,
        writable: false,
        enumerable: typeof name === 'string' ? true : false,
        value: ListNode.prototype[name]
    })
})

propertyNames = Object.getOwnPropertyNames(List.prototype) as (string | symbol)[]
propertyNames.push(...Object.getOwnPropertySymbols(List.prototype))

propertyNames.forEach(name => {
    Object.defineProperty(List.prototype, name, {
        configurable: false,
        writable: false,
        enumerable: typeof name === 'string' ? true : false,
        value: List.prototype[name]
    })
})