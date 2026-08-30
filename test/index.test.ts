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
});
