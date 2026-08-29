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

console.log(queue.size()); // 2
console.log(queue.isEmpty()); // false

// Retrieve items
const first = queue.poll();
console.log(first); // 14.55

const second = queue.poll();
console.log(second); // 30.12

// Returns undefined when empty
console.log(queue.poll()); // undefined
```
