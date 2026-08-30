# buffer-queue-f64

![NPM Version](https://img.shields.io/npm/v/buffer-queue-f64)
![License](https://img.shields.io/npm/l/buffer-queue-f64)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

An extremely fast, dynamically resizing ring buffer queue for JavaScript and TypeScript. Built specifically on top of `Float64Array`, it is designed to hold numbers with maximum performance and minimal memory overhead.

## Why use this?

Standard JavaScript arrays are notoriously slow when used as queues. Using `Array.prototype.shift()` results in $O(N)$ time complexity due to memory relocation. Even array-based pointer queues generate continuous work for the V8 Garbage Collector.

`buffer-queue-f64` uses a contiguous block of memory (`Float64Array`) and a circular pointer architecture (Ring Buffer). This provides an absolute **$O(1)$ amortized time complexity** for both enqueueing and dequeueing operations, entirely bypassing Garbage Collection pauses during steady state.

## Installation

```bash
npm install buffer-queue-f64
```

## Usage

```ts
import { Float64RingQueue } from 'buffer-queue-f64';

// Initialize with an optional starting capacity (default is 1000)
const queue = new Float64RingQueue(4);

// Add items to the queue
queue.add(14.55);
queue.add(30.12);
queue.add(67);

console.log(queue.size()); // 3
console.log(queue.isEmpty()); // false

// Non-destructive peek (view the first item without removing it)
console.log(queue.peek()); // 14.55
console.log(queue.size()); // 3

// Iterability support (non-destructive)
// Iterates from the oldest (head) to the newest (tail) element
console.log([...queue]); // [14.55, 30.12, 67]

// Works with for...of loops
for (const val of queue) {
	console.log(val);
}
// 14.55
// 30.12
// 67

// Retrieve items
const first = queue.poll();
console.log(first); // 14.55

const second = queue.poll();
console.log(second); // 30.12

console.log(queue.poll()); // 67

// Returns undefined when empty
console.log(queue.poll()); // undefined

// Zero-allocation memory recycling
// Resets the internal pointers, completely avoiding Garbage Collection overhead.
queue.add(1000);
queue.clear();
console.log(queue.isEmpty()); // true
```

## API

| Method / Property | Description |
| :--- | :--- |
| `new Float64RingQueue(initialCapacity?: number)` | Creates a new dynamically resizing ring buffer queue. `initialCapacity` (optional) defaults to `1000`. |
| `add(value: number): void` | Pushes a new number to the tail of the queue. If the buffer is full, it dynamically doubles its capacity. |
| `poll(): number \| undefined` | Removes and returns the oldest number from the head of the queue. Returns `undefined` if empty. |
| `peek(): number \| undefined` | Retrieves the oldest number from the head without removing it. Returns `undefined` if empty. |
| `size(): number` | Retrieves the current number of elements stored in the queue. |
| `isEmpty(): boolean` | Checks whether the queue is empty. Returns `true` if it contains no elements, `false` otherwise. |
| `clear(): void` | Clears the queue by resetting internal pointers, completely avoiding Garbage Collection overhead. |
| `[Symbol.iterator](): IterableIterator<number>`| Makes the queue iterable. Allows using `for...of` loops and the spread operator (`[...queue]`). |
