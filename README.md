# buffer-queue-f64

![NPM Version](https://img.shields.io/npm/v/buffer-queue-f64)
![License](https://img.shields.io/npm/l/buffer-queue-f64)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
[![CI](https://github.com/iotamale/buffer-queue-f64/actions/workflows/cicd.yml/badge.svg)](https://github.com/iotamale/buffer-queue-f64/actions/workflows/cicd.yml)

An extremely fast, dynamically resizing ring buffer queue for JavaScript and TypeScript. Built on top of `Float64Array`, it is designed to hold numbers with maximum performance and minimal memory overhead.

## Features

- **Amortized $O(1)$ operations:** Instant enqueueing and dequeueing.
- **No GC overhead:** Use `clear()` method to recycle memory across tasks without triggering Garbage Collector.
- **Native block copying:** Utilizes V8's native memory block copying (`.set()`) for fast resizing.
- **Iterable:** Fully supports `for...of` loops and the spread operator (`...`).
- **Zero dependencies:** Extremely lightweight.

## Caveats & Limitations

This data structure makes deliberate trade-offs:

- **Numbers only:** Backed by a `Float64Array`, it only accepts numbers. It cannot store objects, strings, or other types.
- **Power of 2 allocation:** To enable fast bitwise masking for pointer wrapping (instead of modulo), the allocated capacity is always rounded up to the nearest power of two.

## Under the Hood

Standard JavaScript arrays are notoriously slow when used as queues. `Array.prototype.shift()` results in $O(N)$ time complexity due to memory relocation. Array-based pointer queues avoid this but still generate continuous work for the V8 Garbage Collector.

`buffer-queue-f64` solves this using a contiguous block of memory and a circular pointer architecture (Ring Buffer), bypassing Garbage Collection pauses during steady state.

### Optimizations

- **Bitwise Masking**: The internal capacity is always rounded up to the nearest power of 2. This allows the queue to use a bitwise AND operator instead of a modulo operator for pointer wrapping, resulting in significantly faster element lookups.
- **Auto-Flattening**: Automatically prevents `Number.MAX_SAFE_INTEGER` overflow by resetting and flattening the pointers, and completely resets pointers to `0` whenever the queue is emptied.

## Installation

```bash
npm install buffer-queue-f64
```

## Usage

```ts
import { Float64RingQueue } from 'buffer-queue-f64';

// Initialize with an optional starting capacity (default is 1024)
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

| Method / Property                                | Description                                                                                                                                            |
| :----------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `new Float64RingQueue(initialCapacity?: number)` | Creates a new dynamically resizing ring buffer queue. `initialCapacity` (optional, defaults to `1024`) is always rounded up to the nearest power of 2. |
| `add(value: number): void`                       | Pushes a new number to the tail of the queue. If the buffer is full, it dynamically doubles its capacity.                                              |
| `poll(): number \| undefined`                    | Removes and returns the oldest number from the head of the queue. Returns `undefined` if empty.                                                        |
| `peek(): number \| undefined`                    | Retrieves the oldest number from the head without removing it. Returns `undefined` if empty.                                                           |
| `size(): number`                                 | Retrieves the current number of elements stored in the queue.                                                                                          |
| `isEmpty(): boolean`                             | Checks whether the queue is empty. Returns `true` if it contains no elements, `false` otherwise.                                                       |
| `getCapacity(): number`                          | Retrieves the current allocated capacity of the queue.                                                                                                 |
| `clear(): void`                                  | Clears the queue by resetting internal pointers, completely avoiding Garbage Collection overhead.                                                      |
| `[Symbol.iterator](): IterableIterator<number>`  | Makes the queue iterable. Allows using `for...of` loops and the spread operator (`[...queue]`).                                                        |
