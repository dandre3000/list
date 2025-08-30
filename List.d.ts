/** A doubly linked list node. */
export declare class ListNode<T> {
    #private;
    static [Symbol.hasInstance](instance: any): boolean;
    value: T;
    /**
     * Create a ListNode instance.
     * @throws { TypeError } if called without the new operator
     */
    constructor(value: T);
    /**
     * Create a ListNode instance and insert it into a list at the given index.
     * @throws { TypeError } if called without the new operator
     * @throws { TypeError } if list is not a List instance
     * @throws { RangeError } if the length of list >= 2 ** 24 - 1
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not an integer greater than -1 or less than the length of list + 1
     */
    constructor(value: T, list: List<T>, index: number);
    /**
     * Return the list containing this node or null if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    list(): List<T> | null;
    /**
     * Return the previous node in the list containing this node.
     * Return null if this is the first node in the list or if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    previous(): ListNode<T> | null;
    /**
     * Return the next node in the list containing this node.
     * Return null if this is the last node in the list or if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    next(): ListNode<T> | null;
    /**
     * Remove this node from its containing list and prepend it to another node.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { ReferenceError } if node === this
     * @throws { RangeError } if the node's list length >= 2 ** 24 - 1
     */
    prependTo(node: ListNode<T>): this;
    /**
     * Remove this node from its containing list and append it to another node.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { ReferenceError } if node === this
     * @throws { RangeError } if the node's list length >= 2 ** 24 - 1
     */
    appendTo(node: ListNode<T>): this;
    /**
     * Remove this node from its containing list and insert it into another list at the given index.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if list is not a List instance
     * @throws { RangeError } if list length >= 2 ** 24 - 1
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not an integer greater than -1 or less than the length of list + 1
     */
    insertInto(list: List<T>, index: number): this;
    /**
     * Remove this node from its current list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    remove(): this;
}
/** Doubly linked list */
export declare class List<T> implements Iterable<ListNode<T>> {
    #private;
    /** The maximum length of all lists. */
    static readonly maxLength: number;
    static [Symbol.hasInstance](instance: any): boolean;
    /**
     * Create a List instance with the specified length where all node values are undefined.
     * @throws {TypeError} if called without the new operator
     * @throws {RangeError} if length is not an integer greater than -1 or less than 2 ** 32
     */
    constructor(length: number);
    /**
     * Create a List instance and insert the given values.
     * @throws { TypeError } if called without the new operator
     */
    constructor(...values: T[]);
    /**
     * Return the first node in this list or null if it is empty.
     * @throws { TypeError } if this is not a List instance
     */
    first(): ListNode<T>;
    /**
     * Return the last node in this list or null if it is empty.
     * @throws { TypeError } if this is not a List instance
     */
    last(): ListNode<T>;
    /**
     * Return the length of this list.
     * @throws { TypeError } if this is not a List instance
     */
    length(): number;
    /**
     * Return the node at the given index or null if index is less than -1 or greater than this length - 1
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not an integer
     */
    at: (index: number) => ListNode<T> | null;
    /**
     * Add the given values to the front of this list and return this length.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if list length would be greater than 2 ** 24 - 1
     */
    unshift(...values: T[]): number;
    /**
     * Add the given values to the end of this list and return this length.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if list length would be greater than 2 ** 24 - 1
     */
    push(...values: T[]): number;
    /**
     * Insert the given values into this list at the given index and return this length.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not an integer greater than -1 or less than this length + 1
     * @throws { RangeError } if list length would be greater than 2 ** 24 - 1
     */
    insert(index: number, ...values: T[]): number;
    /**
     * Remove the first node of this list and return it or null if this is empty.
     * @throws { TypeError } if this is not a List instance
     */
    shift(): ListNode<T>;
    /**
     * Remove the last node of this list and return it or null if this is empty.
     * @throws { TypeError } if this is not a List instance
     */
    pop(): ListNode<T>;
    /**
     * Remove a node from this list at the given index and return it.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if index is not a number
     * @throws { RangeError } if index is not an integer greater than -1 or less than this length
     */
    remove(index: number): ListNode<T>;
    /**
     * Remove all nodes in this list.
     * @throws { TypeError } if this is not a List instance
     */
    clear(): this;
    /**
     * Move one or more consecutive nodes from this list and insert them into a new list.
     * The range is defined by Math.min(start, end) to Math.max(start, end).
     * Therefore start or end can be the higher index, (List instance).splice(start, end, ...) and (List instance).splice(end, start, ...) are the same operation.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start or end is not an integer
     * @throws { RangeError } if start or end is less than 0 or greater than or equal to this length
     */
    splice(start: number, end: number): List<T>;
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
    splice(start: number, end: number, list: List<T>, index: number): List<T>;
    /**
     * Set the value of all nodes in this list to the given value.
     * @throws { TypeError } if this is not a List instance
     */
    fill(value: T): this;
    /**
     * Reverse the order of this list.
     * @throws { TypeError } if this is not a List instance
     */
    reverse(): this;
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
    copyWithin(start: number, end: number, target: number, targetEnd?: boolean): this;
    /**
     * Return a copy of a portion of this list.
     * The range is defined by Math.min(start, end) to Math.max(start, end).
     * Therefore start or end can be the higher index, (List instance).slice(start, end) and (List instance).slice(end, start) are the same operation.
     * @param start default 0
     * @param end default this.length() - 1
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start or end is not a number
     * @throws { RangeError } if index is not a integer greater than -1 or less than list length
     */
    slice(start?: number, end?: number): List<T>;
    /**
     * Return true if the value is contained in this list or false if not.
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    includes(value: T, backwards?: boolean): boolean;
    /**
     * Return the index of the first node encountered upon iterating this list that contains the given value or -1 if the value is not in the list.
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    indexOf(value: T, backwards?: boolean): number;
    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return the first node encountered where the callback returns true.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    find(callback: (node: ListNode<T>, index: number, list: List<T>) => void, self?: any, backwards?: boolean): ListNode<T>;
    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return the index of the first node encountered where the callback returns true.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    findIndex(callback: (node: ListNode<T>, index: number, list: List<T>) => void, self?: any, backwards?: boolean): number;
    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return true when the callback returns true or return false.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    some(callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self?: any, backwards?: boolean): boolean;
    /**
     * Iterate this list and calls the given callback once for each node.
     * Break iteration and return false when the callback does not return true or return true.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    every(callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self?: any, backwards?: boolean): boolean;
    /**
     * Iterate this list and calls the given callback once for each node
     * using the return value of the previous call as the accumulator argument for the next call.
     * Return accumulator after the iteration is finished.
     * @param initialValue used as the value of accumulator for the initial call to the callback
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    reduce<U>(callback: (accumulator: U, node: ListNode<T>, index: number, list: List<T>) => U, initialValue: U, self?: any, backwards?: boolean): U;
    /**
     * Iterate this list and call the given callback once for each node and remove the nodes where the callback returned true.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    filter(callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self?: any, backwards?: boolean): this;
    /**
     * Iterate this list and call the given callback once for each node and set its value to the returned value.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    map<U>(callback: (node: ListNode<T>, index: number, list: List<T>) => U, self?: any, backwards?: boolean): List<U>;
    /**
     * Iterate this list and calls the given callback once for each node.
     * @param self used as this when executing the callback
     * @param backwards iterate from first to last if false (default) or from last to first if true
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if backwards is not a boolean
     */
    forEach(callback: (node: ListNode<T>, index: number, list: List<T>) => void, self?: any, backwards?: boolean): this;
    /**
     * Return a new List that is populated by the contents of this list along with the given values.
     * or their contents if the value is an Iterable.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if the new list length would be greater than 2 ** 24 - 1
     */
    concat(...values: (T | ArrayLike<T> | Set<T> | Map<any, T>)[]): List<T>;
    /**
     * Return an array containing each node in this list.
     * @throws { TypeError } if this is not a List instance
     */
    nodes(): ListNode<T>[];
    /**
     * Return an array containing the value of each node in this list.
     * @throws { TypeError } if this is not a List instance
     */
    values(): T[];
    /**
     * Return a string representing this list.
     * @throws { TypeError } if this is not a List instance
     */
    toString(): string;
    /**
     * Return an iterator representng this list.
     * @throws { TypeError } if this is not a List instance
     */
    [Symbol.iterator](): ArrayIterator<ListNode<T>>;
}
