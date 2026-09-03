# buffer-queue-f64

![NPM Version](https://img.shields.io/npm/v/buffer-queue-f64)
![License](https://img.shields.io/npm/l/buffer-queue-f64)
![Zero Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
[![CI](https://github.com/iotamale/buffer-queue-f64/actions/workflows/cicd.yml/badge.svg)](https://github.com/iotamale/buffer-queue-f64/actions/workflows/cicd.yml)

An extremely fast, dynamically resizing ring buffer queue for JavaScript and TypeScript. Built on top of `Float64Array`, it provides absolute **$O(1)$ amortized time complexity** for enqueueing and dequeueing operations, entirely bypassing Garbage Collection pauses during steady state.

## Architecture & Optimizations

Standard JavaScript arrays are notoriously slow when used as queues, as `Array.prototype.shift()` requires $O(N)$ time complexity due to memory relocation. While array-based or linked-list pointer queues solve the time complexity issue, they still generate continuous work for the Garbage Collector by constantly allocating and discarding objects.

This package solves both problems through deliberate engineering trade-offs:

- **Contiguous memory (`Float64Array`)**: By restricting the queue to numbers only, the buffer avoids object allocation entirely.
- **Zero GC overhead**: The `clear()` method recycles the underlying memory buffer for reuse across tasks without ever triggering the Garbage Collector.
- **Bitwise masking**: The internal capacity is strictly rounded up to the nearest power of 2. This allows the queue to use a lightning-fast bitwise AND (`&`) operator instead of a modulo (`%`) operator for pointer wrapping.
- **Native block copying**: When the queue needs to grow, it utilizes V8's native memory block copying (`.set()`) for fast resizing.
- **Auto-flattening**: Prevents `Number.MAX_SAFE_INTEGER` overflow by automatically resetting and flattening pointers when necessary.

## Benchmarks

Tested on Apple M2 (Node.js v26) against 100,000 operations. Lower is better.

| Structure            | Bulk enqueue/dequeue | Steady state (interleaved) | Memory reuse/clear overhead | Memory footprint (avg) |
| :------------------- | :------------------- | :------------------------- | :-------------------------- | :--------------------- |
| **buffer-queue-f64** | **~395 µs**          | **~250 µs**                | **~192 µs**                 | **~3.9 kB**            |
| `denque`             | ~615 µs              | ~309 µs                    | ~222 µs                     | ~2.01 MB               |
| `yocto-queue`        | ~645 µs              | ~503 µs                    | ~216 µs (new allocation)    | ~3.81 MB               |
| Standard array       | ~788,000 µs (788ms)  | ~825 µs                    | ~275 µs (new allocation)    | ~2.66 MB               |

_`buffer-queue-f64` is significantly faster across all scenarios while consuming drastically less memory than object-based or linked-list queues._

## Installation

```bash
npm install buffer-queue-f64
```

## Usage

> [!IMPORTANT]
> This queue strictly accepts **numbers only** (Float64). It cannot store objects, strings, or other data types.

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
