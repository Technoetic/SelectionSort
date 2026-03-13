import {
	DEFAULT_CAPACITY,
	DEFAULT_LOAD_FACTOR_THRESHOLD,
	DEFAULT_COLLISION_STRATEGY,
} from "../utils/constants.js";

/**
 * HashTable implementation with chaining for collision resolution
 */
export class HashTable {
	constructor(
		capacity = DEFAULT_CAPACITY,
		loadFactorThreshold = DEFAULT_LOAD_FACTOR_THRESHOLD,
		collisionStrategy = DEFAULT_COLLISION_STRATEGY,
	) {
		this.capacity = capacity;
		this.loadFactorThreshold = loadFactorThreshold;
		this.collisionStrategy = collisionStrategy;
		this.buckets = Array(capacity)
			.fill(null)
			.map(() => []);
		this.size = 0;
		this.totalCollisions = 0;
		this.totalAccesses = 0;
		this.operationHistory = [];
	}

	/**
	 * Public Methods
	 */

	/**
	 * Insert or update a key-value pair
	 * @param {string|number} key
	 * @param {*} value
	 * @returns {Object} {success, index, updated, rehashed, chainLength}
	 */
	insert(key, value) {
		this.totalAccesses++;
		const index = this.#hash(key);
		const bucket = this.buckets[index];

		// Check if key already exists (update case)
		const existingIndex = bucket.findIndex((item) => item.key === key);
		if (existingIndex !== -1) {
			bucket[existingIndex].value = value;
			return {
				success: true,
				index,
				updated: true,
				rehashed: false,
				chainLength: bucket.length,
			};
		}

		// New insertion
		bucket.push({ key, value });
		this.size++;
		const chainLength = bucket.length;

		// Count collision if chain has more than 1 item
		if (chainLength > 1) {
			this.totalCollisions++;
		}

		// Check if rehashing needed
		let rehashed = false;
		if (this.getLoadFactor() > this.loadFactorThreshold) {
			this.#rehash();
			rehashed = true;
		}

		this.operationHistory.push({
			type: "insert",
			key,
			value,
			timestamp: Date.now(),
			success: true,
		});

		return {
			success: true,
			index,
			updated: false,
			rehashed,
			chainLength,
		};
	}

	/**
	 * Search for a key
	 * @param {string|number} key
	 * @returns {Object} {found, value, index, chainLength, position}
	 */
	search(key) {
		this.totalAccesses++;
		const index = this.#hash(key);
		const bucket = this.buckets[index];

		const itemIndex = bucket.findIndex((item) => item.key === key);

		this.operationHistory.push({
			type: "search",
			key,
			found: itemIndex !== -1,
			timestamp: Date.now(),
		});

		if (itemIndex !== -1) {
			return {
				found: true,
				value: bucket[itemIndex].value,
				index,
				chainLength: bucket.length,
				position: itemIndex,
			};
		}

		return {
			found: false,
			value: null,
			index,
			chainLength: bucket.length,
			position: -1,
		};
	}

	/**
	 * Delete a key
	 * @param {string|number} key
	 * @returns {Object} {success, index, chainLength}
	 */
	delete(key) {
		this.totalAccesses++;
		const index = this.#hash(key);
		const bucket = this.buckets[index];

		const itemIndex = bucket.findIndex((item) => item.key === key);
		if (itemIndex === -1) {
			return {
				success: false,
				index,
				chainLength: bucket.length,
			};
		}

		bucket.splice(itemIndex, 1);
		this.size--;

		this.operationHistory.push({
			type: "delete",
			key,
			timestamp: Date.now(),
			success: true,
		});

		return {
			success: true,
			index,
			chainLength: bucket.length,
		};
	}

	/**
	 * Get current size
	 * @returns {number}
	 */
	getSize() {
		return this.size;
	}

	/**
	 * Get capacity
	 * @returns {number}
	 */
	getCapacity() {
		return this.capacity;
	}

	/**
	 * Get load factor
	 * @returns {number}
	 */
	getLoadFactor() {
		return this.capacity === 0 ? 0 : this.size / this.capacity;
	}

	/**
	 * Get all entries
	 * @returns {Array}
	 */
	getAllEntries() {
		const entries = [];
		for (const bucket of this.buckets) {
			for (const item of bucket) {
				entries.push({ key: item.key, value: item.value });
			}
		}
		return entries;
	}

	/**
	 * Get bucket at specific index
	 * @param {number} index
	 * @returns {Array}
	 */
	getBucket(index) {
		if (index < 0 || index >= this.capacity) {
			return [];
		}
		return this.buckets[index];
	}

	/**
	 * Get all buckets
	 * @returns {Array}
	 */
	getBuckets() {
		return this.buckets.map((bucket) => [...bucket]);
	}

	/**
	 * Get statistics
	 * @returns {Object}
	 */
	getStats() {
		const avgChainLength = this.size === 0 ? 0 : this.size / this.capacity;
		const maxChainLength = Math.max(0, ...this.buckets.map((b) => b.length));

		return {
			size: this.size,
			capacity: this.capacity,
			loadFactor: this.getLoadFactor(),
			totalCollisions: this.totalCollisions,
			totalAccesses: this.totalAccesses,
			avgChainLength,
			maxChainLength,
			emptyBuckets: this.buckets.filter((b) => b.length === 0).length,
		};
	}

	/**
	 * Clear all entries
	 */
	clear() {
		this.buckets = Array(this.capacity)
			.fill(null)
			.map(() => []);
		this.size = 0;
		this.totalCollisions = 0;
		this.totalAccesses = 0;
		this.operationHistory = [];
	}

	/**
	 * Reset to default capacity
	 */
	reset() {
		this.capacity = DEFAULT_CAPACITY;
		this.clear();
	}

	/**
	 * Private Methods
	 */

	/**
	 * Simple hash function
	 * @param {string|number} key
	 * @returns {number} hash value (0 to capacity-1)
	 */
	#hash(key) {
		let hash = 0;
		const keyStr = String(key);

		for (let i = 0; i < keyStr.length; i++) {
			const char = keyStr.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}

		return Math.abs(hash) % this.capacity;
	}

	/**
	 * Rehash: double the capacity and redistribute items
	 */
	#rehash() {
		const oldBuckets = this.buckets;
		const _oldCapacity = this.capacity;

		// Double capacity
		this.capacity *= 2;
		this.buckets = Array(this.capacity)
			.fill(null)
			.map(() => []);
		this.size = 0;

		// Redistribute all items
		for (const bucket of oldBuckets) {
			for (const item of bucket) {
				const newIndex = this.#hash(item.key);
				this.buckets[newIndex].push(item);
				this.size++;
			}
		}
	}
}
