import {
	COLORS,
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	BUCKET_WIDTH,
	BUCKET_HEIGHT,
	ITEM_RADIUS,
	MESSAGE_TYPES,
	MAX_MESSAGE_DURATION,
} from "../utils/constants.js";

/**
 * ViewRenderer: Handles canvas rendering and DOM updates
 */
export class ViewRenderer {
	constructor(canvasElement) {
		this.canvas = canvasElement;
		this.ctx = canvasElement.getContext("2d");
		this.messageQueue = [];
		this.currentMessage = null;
		this.messageTimeout = null;

		this.setupCanvas();
	}

	/**
	 * Setup canvas dimensions
	 */
	setupCanvas() {
		this.canvas.width = CANVAS_WIDTH;
		this.canvas.height = CANVAS_HEIGHT;
	}

	/**
	 * Render hash table buckets
	 * @param {Array} buckets
	 * @param {number} highlightIndex - bucket index to highlight (-1 for none)
	 */
	renderBuckets(buckets, highlightIndex = -1) {
		// Clear canvas
		this.ctx.fillStyle = COLORS.darkBg;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Draw buckets
		const bucketSpacing = CANVAS_WIDTH / buckets.length;
		let xPos = (bucketSpacing - BUCKET_WIDTH) / 2;

		for (let i = 0; i < buckets.length; i++) {
			const bucket = buckets[i];
			const isHighlighted = i === highlightIndex;

			// Draw bucket background
			this.ctx.fillStyle = isHighlighted
				? COLORS.bucketActive
				: bucket.length === 0
					? COLORS.bucketEmpty
					: COLORS.bucketBg;
			this.ctx.fillRect(xPos, 50, BUCKET_WIDTH, BUCKET_HEIGHT);

			// Draw bucket border
			this.ctx.strokeStyle = COLORS.bucketBorder;
			this.ctx.lineWidth = 2;
			this.ctx.strokeRect(xPos, 50, BUCKET_WIDTH, BUCKET_HEIGHT);

			// Draw bucket index
			this.ctx.fillStyle = COLORS.textPrimary;
			this.ctx.font = "bold 12px Arial";
			this.ctx.textAlign = "center";
			this.ctx.fillText(`[${i}]`, xPos + BUCKET_WIDTH / 2, 140);

			// Draw items in bucket (chain)
			let yOffset = 0;
			for (let j = 0; j < bucket.length; j++) {
				const item = bucket[j];
				const yPos = 60 + yOffset * 30;

				// Draw item circle
				this.ctx.beginPath();
				this.ctx.arc(
					xPos + BUCKET_WIDTH / 2,
					yPos,
					ITEM_RADIUS,
					0,
					2 * Math.PI,
				);
				this.ctx.fillStyle = isHighlighted
					? COLORS.itemHighlight
					: COLORS.itemBg;
				this.ctx.fill();
				this.ctx.strokeStyle = COLORS.itemText;
				this.ctx.lineWidth = 1;
				this.ctx.stroke();

				// Draw item text (key)
				this.ctx.fillStyle = COLORS.itemText;
				this.ctx.font = "10px Arial";
				this.ctx.textAlign = "center";
				this.ctx.textBaseline = "middle";
				const keyStr = String(item.key).substring(0, 3);
				this.ctx.fillText(keyStr, xPos + BUCKET_WIDTH / 2, yPos);

				yOffset++;
			}

			xPos += bucketSpacing;
		}

		// Draw legend
		this.#drawLegend();
	}

	/**
	 * Update statistics display
	 * @param {number} size
	 * @param {number} capacity
	 * @param {number} loadFactor
	 * @param {Object} stats
	 */
	updateStats(size, capacity, loadFactor, stats = {}) {
		// Update DOM elements
		const sizeEl = document.getElementById("stat-size");
		const capacityEl = document.getElementById("stat-capacity");
		const loadFactorEl = document.getElementById("stat-loadfactor");
		const loadFactorBarEl = document.getElementById("loadfactor-bar");

		if (sizeEl) sizeEl.textContent = size;
		if (capacityEl) capacityEl.textContent = capacity;
		if (loadFactorEl) loadFactorEl.textContent = loadFactor.toFixed(2);

		// Update load factor bar
		if (loadFactorBarEl) {
			const percentage = Math.min(100, Math.round(loadFactor * 100));
			loadFactorBarEl.style.width = `${percentage}%`;

			// Color based on load factor
			let color = COLORS.success;
			if (loadFactor > 0.75) {
				color = COLORS.danger;
			} else if (loadFactor > 0.5) {
				color = COLORS.warning;
			}
			loadFactorBarEl.style.backgroundColor = color;
		}

		// Update additional stats
		if (stats.totalCollisions !== undefined) {
			const collisionsEl = document.getElementById("stat-collisions");
			if (collisionsEl) {
				collisionsEl.textContent = stats.totalCollisions;
			}
		}

		if (stats.maxChainLength !== undefined) {
			const chainEl = document.getElementById("stat-max-chain");
			if (chainEl) {
				chainEl.textContent = stats.maxChainLength;
			}
		}
	}

	/**
	 * Display a message
	 * @param {string} message
	 * @param {string} type - 'success', 'error', 'info', 'warning'
	 * @param {number} duration - milliseconds
	 */
	displayMessage(
		message,
		type = MESSAGE_TYPES.INFO,
		duration = MAX_MESSAGE_DURATION,
	) {
		const messageArea = document.getElementById("message-area");
		if (!messageArea) return;

		// Clear previous message
		if (this.messageTimeout) {
			clearTimeout(this.messageTimeout);
		}

		// Create message element
		const msgEl = document.createElement("div");
		msgEl.className = `message ${type}`;
		msgEl.textContent = message;
		msgEl.style.animation = "slideIn 0.3s ease-in-out";

		messageArea.innerHTML = "";
		messageArea.appendChild(msgEl);

		// Auto remove after duration
		this.messageTimeout = setTimeout(() => {
			msgEl.style.animation = "slideOut 0.3s ease-in-out";
			setTimeout(() => {
				msgEl.remove();
			}, 300);
		}, duration);
	}

	/**
	 * Display search result
	 * @param {boolean} found
	 * @param {*} value
	 */
	displaySearchResult(found, value) {
		if (found) {
			this.displayMessage(`Found: ${value}`, MESSAGE_TYPES.SUCCESS);
		} else {
			this.displayMessage("Key not found", MESSAGE_TYPES.WARNING);
		}
	}

	/**
	 * Reset/clear view
	 */
	reset() {
		this.ctx.fillStyle = COLORS.darkBg;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// Clear stats
		const statElements = ["stat-size", "stat-capacity", "stat-loadfactor"];
		for (const id of statElements) {
			const el = document.getElementById(id);
			if (el) el.textContent = "0";
		}

		const loadFactorBar = document.getElementById("loadfactor-bar");
		if (loadFactorBar) {
			loadFactorBar.style.width = "0%";
		}

		this.displayMessage("Hash table reset", MESSAGE_TYPES.INFO);
	}

	/**
	 * Private Methods
	 */

	/**
	 * Draw legend
	 */
	#drawLegend() {
		const legendX = 20;
		const legendY = CANVAS_HEIGHT - 80;

		this.ctx.fillStyle = COLORS.textPrimary;
		this.ctx.font = "bold 12px Arial";
		this.ctx.textAlign = "left";
		this.ctx.fillText("Legend:", legendX, legendY);

		// Empty bucket
		this.ctx.fillStyle = COLORS.bucketEmpty;
		this.ctx.fillRect(legendX, legendY + 10, 15, 15);
		this.ctx.strokeStyle = COLORS.bucketBorder;
		this.ctx.strokeRect(legendX, legendY + 10, 15, 15);
		this.ctx.fillStyle = COLORS.textSecondary;
		this.ctx.font = "10px Arial";
		this.ctx.fillText("Empty", legendX + 20, legendY + 22);

		// Occupied bucket
		this.ctx.fillStyle = COLORS.bucketBg;
		this.ctx.fillRect(legendX + 80, legendY + 10, 15, 15);
		this.ctx.strokeStyle = COLORS.bucketBorder;
		this.ctx.strokeRect(legendX + 80, legendY + 10, 15, 15);
		this.ctx.fillStyle = COLORS.textSecondary;
		this.ctx.fillText("Occupied", legendX + 100, legendY + 22);

		// Highlighted bucket
		this.ctx.fillStyle = COLORS.bucketActive;
		this.ctx.fillRect(legendX + 180, legendY + 10, 15, 15);
		this.ctx.strokeStyle = COLORS.bucketBorder;
		this.ctx.strokeRect(legendX + 180, legendY + 10, 15, 15);
		this.ctx.fillStyle = COLORS.textSecondary;
		this.ctx.fillText("Active", legendX + 200, legendY + 22);
	}
}
