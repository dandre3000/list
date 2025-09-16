/** A doubly linked list node. */
export declare class ListNode<T> {
    #private;
    static [Symbol.hasInstance](instance: any): boolean;
    value: T;
    [Symbol.toStringTag]: string;
    /**
     * Create a ListNode instance.
     * @param value The value this node will contain.
     */
    constructor(value: T);
    /**
     * Create a ListNode instance and append or prepend it to another node.
     * @param value The value this node will contain.
     * @param node The node that will be appended or prepended with this.
     * @param append If the append argument is truthy then append this to node else prepend this to node. (default false)
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { RangeError } if node.list.length would exceed List.maxLength
     */
    constructor(value: T, node: ListNode<T>, append?: any);
    /**
     * The list containing this node or null if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    get list(): List<T> | null;
    /**
     * The previous node in this list or null if this is the first node in the list or if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    get previous(): ListNode<T> | null;
    /**
     * The next node in this list or null if this is the last node in the list or if this is not in a list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    get next(): ListNode<T> | null;
    /**
     * Remove this node from its containing list and prepend it to another node.
     * @param node The node that will be prepended with this.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { ReferenceError } if node === this
     * @throws { RangeError } if node.list.length would exceed List.maxLength (16777216)
     */
    prependTo(node: ListNode<T>): this;
    /**
     * Remove this node from its containing list and append it to another node.
     * @throws { TypeError } if this is not a ListNode instance
     * @throws { TypeError } if node is not a ListNode instance
     * @throws { ReferenceError } if node === this
     * @throws { RangeError } if the node's list length would exceed List.maxLength (16777216)
     */
    appendTo(node: ListNode<T>): this;
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
    insertInto(list: List<T>, index?: number): this;
    /**
     * Remove this node from its current list.
     * @throws { TypeError } if this is not a ListNode instance
     */
    remove(): this;
}
interface ListIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): ListIterator<T>;
}
/** Doubly linked list */
export declare class List<T> {
    #private;
    /** The maximum length of all lists. */
    static readonly maxLength = 16777216;
    /**
     * Create a new, shallow-copied List instance from an iterable.
     * @param items An iterable to convert to a List.
     */
    static from<T>(items: Iterable<T>): List<T>;
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
    static from<T, U>(items: Iterable<T>, mapFn: (element: T, index: number) => U, self?: any): List<U>;
    /**
     * Asynchronously create a new, shallow-copied List instance from an iterable.
     * @param items An iterable to convert to a List.
     */
    static fromAsync<T>(items: Iterable<T> | AsyncIterable<T>): Promise<List<T>>;
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
    static fromAsync<T, U>(items: Iterable<T> | AsyncIterable<T>, mapFn: (element: T, index: number) => U, self?: any): Promise<List<U>>;
    static [Symbol.hasInstance](instance: any): boolean;
    [Symbol.toStringTag]: string;
    /**
     * Create a List instance with the specified length where all node values are undefined.
     * @param length The amount of nodes this list will initially contain.
     * @throws {RangeError} if length is not an integer greater than -1 and less than List.maxLength (16777216)
     */
    constructor(length: number);
    /**
     * Create a List instance and insert the given values.
     * @param values The values this list will initially contain.
     */
    constructor(...values: T[]);
    /**
     * The first node in this list or null if this is empty.
     * @throws { TypeError } if this is not a List instance
     */
    get first(): ListNode<T>;
    /**
     * The last node in this list or null if this is empty.
     * @throws { TypeError } if this is not a List instance
     */
    get last(): ListNode<T>;
    /**
     * The length of this list.
     * @throws { TypeError } if this is not a List instance
     */
    get length(): number;
    /**
     * Return the node at the given index or null if index is out of bounds.
     * @param index The position of the node. (default 0)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if index can not be converted to a number
     */
    at(index?: number): ListNode<T> | null;
    /**
     * Insert the values to the front of this list and return this length.
     * @param values The values to be inserted.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if list.length would exceed List.maxLength (16777216)
     */
    unshift(...values: T[]): number;
    /**
     * Insert the values to the end of this list and return this length.
     * @param values The values to be inserted.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if list.length would exceed List.maxLength (2 ** 24 - 1)
     */
    push(...values: T[]): number;
    /**
     * Insert the values into this list at the given index and return this length.
     * @param index The position where values will be inserted. (default 0)
     * @param values The values to be inserted.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if index can not be converted to a number
     * @throws { RangeError } if index is not greater than or equal to 0 and less than or equal to this.length
     * @throws { RangeError } if this.length would exceed List.maxLength (2 ** 24 - 1)
     */
    insert(index?: number, ...values: T[]): number;
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
     * @param index The position of the node.
     * @throws { TypeError } if this is not a List instance
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
     * Therefore start or end can be the higher index, (List instance).splice(start, end, ...)
     * and (List instance).splice(end, start, ...) are the same operation.
     * @param start The position that along with end determines the range of nodes to move.
     * @param end The position that along with start determines the range of nodes to move.
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if start or end can not be converted to a number
     * @throws { RangeError } if start or end is not greater than or equal to 0 and less than this.length
     */
    splice(start: number, end: number): List<T>;
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
    splice(start: number, end: number, list: List<T>, target: number): List<T>;
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
    copyWithin(start?: number, end?: number, target?: number, targetEnd?: boolean): this;
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
    sort(callback: (a: ListNode<T>, b: ListNode<T>) => number): this;
    /**
     * Concatenate all nested lists into this recursively up to the specified depth.
     * @param depth The maximum recursion depth. (default 1)
     * @throws { TypeError } if this is not a List instance
     * @throws { TypeError } if depth can not be converted to a number
     * @throws { RangeError } if depth is not greater than 0
     * @throws { RangeError } if this.length would exceed List.maxLength (16777216)
     */
    flat(depth?: number): this;
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
    slice(start?: number, end?: number): List<T>;
    /**
     * Return true if the value is contained in this list or false if not.
     * @param value The value to search for.
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     */
    includes(value: T, backwards?: boolean): boolean;
    /**
     * Return the index of the first node encountered upon iterating this list that contains the given value or -1 if the value is not in the list.
     * @param backwards Iterate from first to last if falsy or from last to first if truthy. (default false)
     * @throws { TypeError } if this is not a List instance
     */
    indexOf(value: T, backwards?: boolean): number;
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
    find(callback: (node: ListNode<T>, index: number, list: List<T>) => void, self?: any, backwards?: boolean): ListNode<T>;
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
    findIndex(callback: (node: ListNode<T>, index: number, list: List<T>) => void, self?: any, backwards?: boolean): number;
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
    some(callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self?: any, backwards?: boolean): boolean;
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
    every(callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self?: any, backwards?: boolean): boolean;
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
    reduce<U>(callback: (accumulator: U, node: ListNode<T>, index: number, list: List<T>) => U, initialValue: U, self?: any, backwards?: boolean): U;
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
    filter(callback: (node: ListNode<T>, index: number, list: List<T>) => boolean, self?: any, backwards?: boolean): this;
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
    map<U>(callback: (node: ListNode<T>, index: number, list: List<T>) => U, self?: any, backwards?: boolean): List<U>;
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
    forEach(callback: (node: ListNode<T>, index: number, list: List<T>) => void, self?: any, backwards?: boolean): this;
    /**
     * Return a new List that is populated by the contents of this list along with the given values.
     * or their contents if the value is a List.
     * @throws { TypeError } if this is not a List instance
     * @throws { RangeError } if the new list length would exceed List.maxLength (16777216)
     */
    concat(...values: (T | List<T>)[]): List<T>;
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
    [Symbol.iterator](): ListIterator<ListNode<T>>;
}
export {};
