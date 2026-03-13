class HashTable {
	#buckets;
	#size;
	#count;
	#hashSteps; // 시각화용 해시 계산 과정 저장

	constructor(size = 7) {
		this.#size = size;
		this.#count = 0;
		this.#buckets = Array.from({ length: size }, () => []);
		this.#hashSteps = [];
	}

	_hash(key) {
		this.#hashSteps = [];
		let hash = 0;
		const keyStr = String(key).toLowerCase();
		for (let i = 0; i < keyStr.length; i++) {
			const charCode = keyStr.charCodeAt(i);
			hash = (hash + charCode * (i + 1)) % this.#size;
			this.#hashSteps.push({
				char: keyStr[i],
				charCode,
				position: i + 1,
				product: charCode * (i + 1),
				runningHash: hash,
			});
		}
		return hash;
	}

	getHashSteps() {
		return [...this.#hashSteps];
	}

	insert(key, value) {
		const index = this._hash(key);
		const bucket = this.#buckets[index];
		const existing = bucket.findIndex((item) => item.key === key);
		const collision = bucket.length > 0 && existing === -1;

		if (existing !== -1) {
			const oldValue = bucket[existing].value;
			bucket[existing].value = value;
			return {
				index,
				collision: false,
				updated: true,
				oldValue,
				chain: [...bucket],
				hashSteps: this.getHashSteps(),
			};
		} else {
			bucket.push({ key, value });
			this.#count++;
			return {
				index,
				collision,
				updated: false,
				chain: [...bucket],
				hashSteps: this.getHashSteps(),
			};
		}
	}

	search(key) {
		const index = this._hash(key);
		const bucket = this.#buckets[index];
		let steps = 0;
		for (const item of bucket) {
			steps++;
			if (item.key === key) {
				return {
					found: true,
					value: item.value,
					steps,
					index,
					hashSteps: this.getHashSteps(),
				};
			}
		}
		return {
			found: false,
			value: null,
			steps,
			index,
			hashSteps: this.getHashSteps(),
		};
	}

	delete(key) {
		const index = this._hash(key);
		const bucket = this.#buckets[index];
		const pos = bucket.findIndex((item) => item.key === key);
		if (pos !== -1) {
			const removed = bucket.splice(pos, 1)[0];
			this.#count--;
			return {
				deleted: true,
				index,
				item: removed,
				hashSteps: this.getHashSteps(),
			};
		}
		return { deleted: false, index, hashSteps: this.getHashSteps() };
	}

	getAll() {
		const items = [];
		this.#buckets.forEach((bucket, index) => {
			bucket.forEach((item) => {
				items.push({ ...item, index });
			});
		});
		return items;
	}

	getBuckets() {
		return this.#buckets.map((bucket, index) => ({
			index,
			items: [...bucket],
			isEmpty: bucket.length === 0,
			hasCollision: bucket.length > 1,
		}));
	}

	getLoadFactor() {
		return this.#count / this.#size;
	}

	getSize() {
		return this.#size;
	}
	getCount() {
		return this.#count;
	}

	resize(newSize) {
		const oldItems = this.getAll();
		this.#size = newSize;
		this.#count = 0;
		this.#buckets = Array.from({ length: newSize }, () => []);
		oldItems.forEach((item) => this.insert(item.key, item.value));
	}

	clear() {
		this.#buckets = Array.from({ length: this.#size }, () => []);
		this.#count = 0;
	}
}
