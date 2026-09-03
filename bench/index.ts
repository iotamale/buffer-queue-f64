import { run, bench, group } from 'mitata';
import { Float64RingQueue } from '../src/index';
import Denque from 'denque';
import Queue from 'yocto-queue';

const ITEMS_LARGE = 100_000;
const ITEMS_SMALL = 1_000;

group(`Bulk enqueue & dequeue (${ITEMS_LARGE} items)`, () => {
	bench('Standard array (push/shift)', () => {
		const arr: number[] = [];
		for (let i = 0; i < ITEMS_LARGE; i++) arr.push(i);
		for (let i = 0; i < ITEMS_LARGE; i++) arr.shift();
	});

	bench('yocto-queue (linked list)', () => {
		const queue = new Queue<number>();
		for (let i = 0; i < ITEMS_LARGE; i++) queue.enqueue(i);
		for (let i = 0; i < ITEMS_LARGE; i++) queue.dequeue();
	});

	bench('denque (dynamic array)', () => {
		const queue = new Denque<number>();
		for (let i = 0; i < ITEMS_LARGE; i++) queue.push(i);
		for (let i = 0; i < ITEMS_LARGE; i++) queue.shift();
	});

	bench('buffer-queue-f64', () => {
		const queue = new Float64RingQueue();
		for (let i = 0; i < ITEMS_LARGE; i++) queue.add(i);
		for (let i = 0; i < ITEMS_LARGE; i++) queue.poll();
	});
});

group(`Steady state / interleaved (${ITEMS_LARGE} iterations)`, () => {
	bench('Standard array (push/shift)', () => {
		const arr: number[] = [0, 0, 0];
		for (let i = 0; i < ITEMS_LARGE; i++) {
			arr.push(i);
			arr.shift();
		}
	});

	bench('yocto-queue', () => {
		const queue = new Queue<number>();
		queue.enqueue(0);
		queue.enqueue(0);
		queue.enqueue(0);
		for (let i = 0; i < ITEMS_LARGE; i++) {
			queue.enqueue(i);
			queue.dequeue();
		}
	});

	bench('denque', () => {
		const queue = new Denque<number>([0, 0, 0]);
		for (let i = 0; i < ITEMS_LARGE; i++) {
			queue.push(i);
			queue.shift();
		}
	});

	bench('buffer-queue-f64', () => {
		const queue = new Float64RingQueue();
		queue.add(0);
		queue.add(0);
		queue.add(0);
		for (let i = 0; i < ITEMS_LARGE; i++) {
			queue.add(i);
			queue.poll();
		}
	});
});

group(`Memory reuse / clear overhead (${ITEMS_SMALL} items)`, () => {
	bench('Standard array (new allocation)', () => {
		for (let cycle = 0; cycle < 100; cycle++) {
			const arr: number[] = [];
			for (let i = 0; i < ITEMS_SMALL; i++) arr.push(i);
		}
	});

	bench('yocto-queue (new allocation)', () => {
		for (let cycle = 0; cycle < 100; cycle++) {
			const queue = new Queue<number>();
			for (let i = 0; i < ITEMS_SMALL; i++) queue.enqueue(i);
		}
	});

	bench('denque (.clear() reuse)', () => {
		const queue = new Denque<number>();
		for (let cycle = 0; cycle < 100; cycle++) {
			for (let i = 0; i < ITEMS_SMALL; i++) queue.push(i);
			queue.clear();
		}
	});

	bench('buffer-queue-f64 (.clear() reuse)', () => {
		const queue = new Float64RingQueue(ITEMS_SMALL);
		for (let cycle = 0; cycle < 100; cycle++) {
			for (let i = 0; i < ITEMS_SMALL; i++) queue.add(i);
			queue.clear();
		}
	});
});

async function main() {
	await run();
}

main().catch(console.error);
