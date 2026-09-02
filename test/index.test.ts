import { describe, it, expect } from 'vitest';
import { Float64RingQueue } from '../src/index';

describe('Float64RingQueue', () => {
	it('should correctly add and poll items', () => {
		const queue = new Float64RingQueue(4);

		expect(queue.isEmpty()).toBe(true);

		queue.add(10.5);
		queue.add(20.2);

		expect(queue.size()).toBe(2);
		expect(queue.poll()).toBe(10.5);
		expect(queue.poll()).toBe(20.2);
		expect(queue.isEmpty()).toBe(true);
	});

	it('should automatically resize when capacity is reached', () => {
		const queue = new Float64RingQueue(4);

		queue.add(1);
		queue.add(2);
		queue.add(3);
		queue.add(4);

		queue.add(5); // resize here

		expect(queue.size()).toBe(5);
		expect(queue.poll()).toBe(1);
		expect(queue.poll()).toBe(2);
		expect(queue.poll()).toBe(3);
		expect(queue.poll()).toBe(4);
		expect(queue.poll()).toBe(5);
	});

	it('should correctly resize when buffer pointers are wrapped around', () => {
		const queue = new Float64RingQueue(4);

		queue.add(1);
		queue.add(2);
		queue.add(3);
		queue.poll();
		queue.poll();

		queue.add(4);
		queue.add(5);
		queue.add(6);

		queue.add(7); // triggers resize; this.head > 0 condition is met

		expect(queue.size()).toBe(5);
		expect(queue.poll()).toBe(3);
		expect(queue.poll()).toBe(4);
		expect(queue.poll()).toBe(5);
		expect(queue.poll()).toBe(6);
		expect(queue.poll()).toBe(7);
		expect(queue.isEmpty()).toBe(true);
	});

	it('should return undefined when empty', () => {
		const queue = new Float64RingQueue();
		expect(queue.poll()).toBeUndefined();
		expect(queue.peek()).toBeUndefined();
	});

	it('should peek items without modyfing the queue', () => {
		const queue = new Float64RingQueue();

		queue.add(10.5);
		queue.add(20.2);

		expect(queue.size()).toBe(2);
		expect(queue.peek()).toBe(10.5);
		expect(queue.peek()).toBe(10.5);

		expect(queue.size()).toBe(2);
		expect(queue.poll()).toBe(10.5);

		expect(queue.peek()).toBe(20.2);
		expect(queue.poll()).toBe(20.2);

		expect(queue.isEmpty()).toBe(true);
	});

	it('should correctly clear', () => {
		const queue = new Float64RingQueue(4);

		queue.add(1);
		queue.add(2);
		expect(queue.size()).toBe(2);

		queue.clear();
		expect(queue.size()).toBe(0);

		queue.add(3);
		expect(queue.poll()).toBe(3);

		expect(queue.size()).toBe(0);
	});

	it('should be iterable using for...of and spread operator', () => {
		const queue = new Float64RingQueue(4);

		queue.add(1.5);
		queue.add(2.5);
		queue.add(3.5);

		// spread operator
		expect([...queue]).toEqual([1.5, 2.5, 3.5]);

		// for ... of
		const result: number[] = [];
		for (const val of queue) {
			result.push(val);
		}
		expect(result).toEqual([1.5, 2.5, 3.5]);

		// wrap-around
		queue.poll();
		queue.add(4.5);
		queue.add(5.5);

		expect([...queue]).toEqual([2.5, 3.5, 4.5, 5.5]);

		// iterator does NOT modify the queue
		expect(queue.size()).toBe(4);
	});

	it('should correctly handle initial capacities', () => {
		// rounding up
		const queue1 = new Float64RingQueue(1000);
		const queue2 = new Float64RingQueue(1024);

		queue1.add(1);
		expect(queue1.size()).toBe(1);

		expect(queue1.getCapacity()).toBe(1024);
		expect(queue2.getCapacity()).toBe(1024);

		// initialCapacity <= 0
		const queue3 = new Float64RingQueue(0);
		const queue4 = new Float64RingQueue(-1);

		expect(queue3.getCapacity()).toBe(1);
		expect(queue4.getCapacity()).toBe(1);

		queue3.add(1);
		expect(queue3.size()).toBe(1);

		queue3.add(2);
		expect(queue3.size()).toBe(2);
		expect(queue3.poll()).toBe(1);
		expect(queue3.poll()).toBe(2);
	});

	it('should reset counters when tail exceeds MAX_SAFE_INTEGER', () => {
		const queue = new Float64RingQueue(4);

		(queue as any).head = Number.MAX_SAFE_INTEGER - 1;
		(queue as any).tail = Number.MAX_SAFE_INTEGER - 1;

		queue.add(1); // tail := MAX_SAFE_INTEGER
		queue.add(2); // tail := MAX_SAFE_INTEGER + 1
		queue.add(3); // resetCounters() is called

		expect((queue as any).head).toBe(0);
		expect((queue as any).tail).toBe(3);
		expect(queue.size()).toBe(3);

		expect([...queue]).toEqual([1, 2, 3]);
	});
});
