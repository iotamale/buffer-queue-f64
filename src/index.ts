export class Float64RingQueue {
	private buffer: Float64Array;
	private head: number = 0;
	private tail: number = 0;
	private capacity: number;
	private currSize: number = 0;

	/**
	 * @param initialCapacity Inital capacity, 1000 by default.
	 */
	constructor(initialCapacity: number = 1000) {
		this.capacity = initialCapacity;
		this.buffer = new Float64Array(this.capacity);
	}

	public add(value: number): void {
		if (this.currSize === this.capacity) {
			this.resize();
		}

		this.buffer[this.tail] = value;
		this.tail = (this.tail + 1) % this.capacity;

		this.currSize++;
	}

	public poll(): number | undefined {
		if (this.currSize === 0) {
			return undefined;
		}

		const value = this.buffer[this.head];
		this.head = (this.head + 1) % this.capacity;

		this.currSize--;

		return value;
	}

	public size(): number {
		return this.currSize;
	}

	public isEmpty(): boolean {
		return this.currSize === 0;
	}

	private resize(): void {
		const newCapacity = this.capacity * 2;
		const newBuffer = new Float64Array(newCapacity);

		for (let i = 0; i < this.currSize; i++) {
			newBuffer[i] = this.buffer[(this.head + i) % this.capacity];
		}

		this.buffer = newBuffer;
		this.capacity = newCapacity;

		this.head = 0;
		this.tail = this.currSize;
	}
}
