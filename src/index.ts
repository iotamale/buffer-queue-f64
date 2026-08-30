export class Float64RingQueue {
	private buffer: Float64Array;
	private head: number = 0;
	private tail: number = 0;
	private capacity: number;
	private currSize: number = 0;

	/**
	 * Creates a new dynamically resizing ring buffer queue.
	 *
	 * @param initialCapacity Initial size of the buffer (1000 by default).
	 */
	constructor(initialCapacity: number = 1000) {
		this.capacity = initialCapacity;
		this.buffer = new Float64Array(this.capacity);
	}

	/**
	 * Pushes a new number to the tail of the queue.
	 * If the buffer is full, it dynamically doubles its capacity.
	 *
	 * @param value The number to be added to the queue.
	 */
	public add(value: number): void {
		if (this.currSize === this.capacity) {
			this.resize();
		}

		this.buffer[this.tail] = value;
		this.tail = (this.tail + 1) % this.capacity;

		this.currSize++;
	}

	/**
	 * Removes and returns the oldest number from the head of the queue.
	 *
	 * @returns The removed number, or `undefined` if the queue is empty.
	 */
	public poll(): number | undefined {
		if (this.currSize === 0) {
			return undefined;
		}

		const value = this.buffer[this.head];
		this.head = (this.head + 1) % this.capacity;

		this.currSize--;

		return value;
	}

	/**
	 * Retrieves the oldest number from the head of the queue without removing it.
	 *
	 * @returns The number at the head of the queue, or `undefined` if the queue is empty.
	 */
	public peek(): number | undefined {
		if (this.currSize === 0) {
			return undefined;
		}

		return this.buffer[this.head];
	}

	/**
	 * Retrieves the current number of elements stored in the queue.
	 *
	 * @returns The number of elements in the queue.
	 */
	public size(): number {
		return this.currSize;
	}

	/**
	 * Checks whether the queue is empty.
	 *
	 * @returns `true` if the queue contains no elements, `false` otherwise.
	 */
	public isEmpty(): boolean {
		return this.currSize === 0;
	}

	/**
	 * Clears all elements from the queue by resetting the internal pointers.
	 * This keeps the underlying memory buffer intact, completely avoiding Garbage Collection overhead during reuse.
	 */
	public clear(): void {
		this.head = 0;
		this.tail = 0;
		this.currSize = 0;
	}

	/**
	 * Doubles the buffer capacity and realigns the elements to start from index 0.
	 * Uses native memory block copying to maximise performance.
	 */
	private resize(): void {
		const newCapacity = this.capacity * 2;
		const newBuffer = new Float64Array(newCapacity);

		newBuffer.set(this.buffer.subarray(this.head, this.capacity), 0);

		if (this.head > 0) {
			newBuffer.set(this.buffer.subarray(0, this.head), this.capacity - this.head);
		}

		this.buffer = newBuffer;
		this.capacity = newCapacity;

		this.head = 0;
		this.tail = this.currSize;
	}

	/**
	 * Makes the queue iterable.
	 * Allows using `for...of` loops and the spread operator `[...queue]`.
	 * Iterates from the oldest (head) to the newest (tail) element without modifying the queue.
	 */
	public *[Symbol.iterator](): IterableIterator<number> {
		let current = this.head;

		for (let i = 0; i < this.currSize; i++) {
			yield this.buffer[current];

			current++;

			if (current === this.capacity) {
				current = 0;
			}
		}
	}
}
