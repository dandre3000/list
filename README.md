// methods contain as few function calls as possible; anti DRY

// private properties are contained in an object in the #data property
// #data objects are contained in a single WeakMap with their instances as keys

// user can extend List and ListNode classes
// user can reassign the ListNode class that a subclassed List creates internally and vice-versa if
// it is a subclass of the internal class used by the super class
// eg if ChildList extends List then ChildList.ListNode must extend List.ListNode which is the base ListNode
// if GrandChildList extends ChildList and ChildList.ListNode === ChildListNode then GrandChildList.ListNode must extend ChildListNode
