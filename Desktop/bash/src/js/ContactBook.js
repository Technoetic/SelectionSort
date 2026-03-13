class ContactBook {
	#hashTable;

	constructor(hashTable) {
		this.#hashTable = hashTable;
	}

	addContact(name, phone) {
		if (!name || !phone) {
			return { success: false, error: "이름과 전화번호를 모두 입력하세요." };
		}
		const result = this.#hashTable.insert(name, phone);
		return { success: true, ...result };
	}

	findContact(name) {
		if (!name) {
			return { success: false, error: "검색할 이름을 입력하세요." };
		}
		const result = this.#hashTable.search(name);
		return { success: true, ...result };
	}

	removeContact(name) {
		if (!name) {
			return { success: false, error: "삭제할 이름을 입력하세요." };
		}
		const result = this.#hashTable.delete(name);
		return { success: true, ...result };
	}

	getAllContacts() {
		return this.#hashTable.getAll();
	}

	getStats() {
		return {
			total: this.#hashTable.getCount(),
			tableSize: this.#hashTable.getSize(),
			loadFactor: this.#hashTable.getLoadFactor(),
			buckets: this.#hashTable.getBuckets(),
			collisionCount: this.#hashTable.getBuckets().filter((b) => b.hasCollision)
				.length,
		};
	}

	getHashTable() {
		return this.#hashTable;
	}
}
