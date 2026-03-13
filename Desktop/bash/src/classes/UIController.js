import { MESSAGE_TYPES } from "../utils/constants.js";

/**
 * UIController: Coordinates user interactions between HashTable, AnimationManager, and ViewRenderer
 */
export class UIController {
	constructor(hashTable, animationManager, viewRenderer) {
		this.hashTable = hashTable;
		this.animationManager = animationManager;
		this.viewRenderer = viewRenderer;
		this.isAnimating = false;
	}

	/**
	 * Handle insert operation
	 * @param {string} key
	 * @param {*} value
	 */
	async handleInsert(key, value) {
		if (this.isAnimating) {
			this.viewRenderer.displayMessage(
				"Animation in progress",
				MESSAGE_TYPES.WARNING,
			);
			return;
		}

		// Validate input
		if (!this.#validateInput(key)) {
			this.viewRenderer.displayMessage("Invalid key", MESSAGE_TYPES.ERROR);
			return;
		}

		this.isAnimating = true;

		try {
			// Perform insertion
			const result = this.hashTable.insert(key, value);

			if (result.success) {
				// Play animation
				await this.animationManager.playInsertAnimation(
					result.index,
					key,
					value,
				);

				// Update UI
				this.#updateUI();

				// Display message
				const msg = result.updated ? `Updated: ${key}` : `Inserted: ${key}`;
				const type = result.rehashed
					? MESSAGE_TYPES.INFO
					: MESSAGE_TYPES.SUCCESS;

				this.viewRenderer.displayMessage(msg, type);
			}
		} catch (error) {
			console.error("Insert error:", error);
			this.viewRenderer.displayMessage("Insert failed", MESSAGE_TYPES.ERROR);
		} finally {
			this.isAnimating = false;
		}
	}

	/**
	 * Handle search operation
	 * @param {string} key
	 */
	async handleSearch(key) {
		if (this.isAnimating) {
			this.viewRenderer.displayMessage(
				"Animation in progress",
				MESSAGE_TYPES.WARNING,
			);
			return;
		}

		// Validate input
		if (!this.#validateInput(key)) {
			this.viewRenderer.displayMessage("Invalid key", MESSAGE_TYPES.ERROR);
			return;
		}

		this.isAnimating = true;

		try {
			// Perform search
			const result = this.hashTable.search(key);

			// Play animation
			await this.animationManager.playSearchAnimation(
				result.index,
				result.found,
			);

			// Display result
			this.viewRenderer.displaySearchResult(result.found, result.value);

			// Update UI
			this.#updateUI();
		} catch (error) {
			console.error("Search error:", error);
			this.viewRenderer.displayMessage("Search failed", MESSAGE_TYPES.ERROR);
		} finally {
			this.isAnimating = false;
		}
	}

	/**
	 * Handle delete operation
	 * @param {string} key
	 */
	async handleDelete(key) {
		if (this.isAnimating) {
			this.viewRenderer.displayMessage(
				"Animation in progress",
				MESSAGE_TYPES.WARNING,
			);
			return;
		}

		// Validate input
		if (!this.#validateInput(key)) {
			this.viewRenderer.displayMessage("Invalid key", MESSAGE_TYPES.ERROR);
			return;
		}

		this.isAnimating = true;

		try {
			// Perform deletion
			const result = this.hashTable.delete(key);

			if (result.success) {
				// Play animation
				await this.animationManager.playDeleteAnimation(result.index, key);

				// Update UI
				this.#updateUI();

				// Display message
				this.viewRenderer.displayMessage(
					`Deleted: ${key}`,
					MESSAGE_TYPES.SUCCESS,
				);
			} else {
				this.viewRenderer.displayMessage(
					`Key not found: ${key}`,
					MESSAGE_TYPES.WARNING,
				);
			}
		} catch (error) {
			console.error("Delete error:", error);
			this.viewRenderer.displayMessage("Delete failed", MESSAGE_TYPES.ERROR);
		} finally {
			this.isAnimating = false;
		}
	}

	/**
	 * Handle reset operation
	 */
	handleReset() {
		if (this.isAnimating) {
			this.viewRenderer.displayMessage(
				"Animation in progress",
				MESSAGE_TYPES.WARNING,
			);
			return;
		}

		this.animationManager.cancelAll();
		this.hashTable.reset();
		this.viewRenderer.reset();
		this.isAnimating = false;
	}

	/**
	 * Handle speed change
	 * @param {number} speed
	 */
	handleSpeedChange(speed) {
		this.animationManager.setSpeed(speed);
	}

	/**
	 * Set animation state
	 * @param {boolean} isAnimating
	 */
	setAnimating(isAnimating) {
		this.isAnimating = isAnimating;
	}

	/**
	 * Private Methods
	 */

	/**
	 * Validate input
	 * @param {string} input
	 * @returns {boolean}
	 */
	#validateInput(input) {
		if (!input) {
			return false;
		}

		const trimmed = String(input).trim();
		return trimmed.length > 0;
	}

	/**
	 * Update UI after operation
	 */
	#updateUI() {
		const stats = this.hashTable.getStats();

		// Render buckets with highlight (if any)
		const buckets = this.hashTable.getBuckets();
		this.viewRenderer.renderBuckets(buckets, -1);

		// Update statistics
		this.viewRenderer.updateStats(
			stats.size,
			stats.capacity,
			stats.loadFactor,
			stats,
		);
	}
}
