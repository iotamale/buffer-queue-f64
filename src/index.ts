export class Float64RingQueue {
	private buffer: Float64Array;
	private head: number = 0;
	private tail: number = 0;
	private capacity: number;
	private mask: number;

	/**
	 * Creates a new dynamically resizing ring buffer queue.
	 * The capacity is always rounded up to the nearest power of 2 to
	 * allow bitwise masking.
	 *
	 * @param initialCapacity Initial size of the buffer (1024 by default).
	 */
	constructor(initialCapacity: number = 1024) {
		const safeCapacity = Math.max(1, initialCapacity);
		const nearestPowerOf2 = Math.pow(2, Math.ceil(Math.log2(safeCapacity)));
		this.capacity = nearestPowerOf2;

		this.buffer = new Float64Array(this.capacity);
		this.mask = this.capacity - 1;
	}

	/**
	 * Pushes a new number to the tail of the queue.
	 * If the buffer is full, it dynamically doubles its capacity.
	 *
	 * @param value The number to be added to the queue.
	 */
	public add(value: number): void {
		if (this.tail - this.head === this.capacity) {
			this.resize();
		}

		if (this.tail > Number.MAX_SAFE_INTEGER) {
			this.resetCounters();
		}

		this.buffer[this.tail & this.mask] = value;
		this.tail++;
	}

	/**
	 * Removes and returns the oldest number from the head of the queue.
	 *
	 * @returns The removed number, or `undefined` if the queue is empty.
	 */
	public poll(): number | undefined {
		if (this.head === this.tail) {
			return undefined;
		}

		const value = this.buffer[this.head & this.mask];
		this.head++;

		// Reset ptrs to 0 when empty.
		if (this.head === this.tail) {
			this.head = 0;
			this.tail = 0;
		}

		return value;
	}

	/**
	 * Retrieves the oldest number from the head of the queue without removing it.
	 *
	 * @returns The number at the head of the queue, or `undefined` if the queue is empty.
	 */
	public peek(): number | undefined {
		if (this.head === this.tail) {
			return undefined;
		}

		return this.buffer[this.head & this.mask];
	}

	/**
	 * Retrieves the current number of elements stored in the queue.
	 *
	 * @returns The number of elements in the queue.
	 */
	public size(): number {
		return this.tail - this.head;
	}

	/**
	 * Checks whether the queue is empty.
	 *
	 * @returns `true` if the queue contains no elements, `false` otherwise.
	 */
	public isEmpty(): boolean {
		return this.head === this.tail;
	}

	/**
	 * Retrieves the current allocated capacity of the queue.
	 *
	 * @returns The total capacity of the buffer.
	 */
	public getCapacity(): number {
		return this.capacity;
	}

	/**
	 * Clears all elements from the queue by resetting the internal pointers.
	 * This keeps the underlying memory buffer intact, completely avoiding Garbage Collection overhead during reuse.
	 */
	public clear(): void {
		this.head = 0;
		this.tail = 0;
	}

	/**
	 * Doubles the buffer capacity and realigns the elements to start from index 0.
	 * Uses native memory block copying to maximise performance.
	 */
	private resize(): void {
		const newCapacity = this.capacity * 2;
		const newBuffer = new Float64Array(newCapacity);

		const physicalHead = this.head & this.mask;
		newBuffer.set(this.buffer.subarray(physicalHead), 0);
		newBuffer.set(this.buffer.subarray(0, physicalHead), this.capacity - physicalHead);

		this.buffer = newBuffer;
		this.capacity = newCapacity;
		this.mask = newCapacity - 1;

		this.tail = this.tail - this.head;
		this.head = 0;
	}

	/**
	 * Flattens the buffer and resets pointers to 0 to prevent int overflow.
	 */
	private resetCounters(): void {
		const currentSize = this.tail - this.head;
		const newBuffer = new Float64Array(this.capacity);

		for (let i = 0; i < currentSize; i++) {
			newBuffer[i] = this.buffer[(this.head + i) & this.mask];
		}

		this.buffer = newBuffer;
		this.head = 0;
		this.tail = currentSize;
	}

	/**
	 * Makes the queue iterable.
	 * Allows using `for...of` loops and the spread operator `[...queue]`.
	 * Iterates from the oldest (head) to the newest (tail) element without modifying the queue.
	 */
	public *[Symbol.iterator](): IterableIterator<number> {
		for (let i = this.head; i < this.tail; i++) {
			yield this.buffer[i & this.mask];
		}
	}
}
