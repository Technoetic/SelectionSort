import gsap from "gsap";
import { ANIMATION_DURATION } from "../utils/constants.js";

/**
 * AnimationManager: Handles GSAP-based animations
 */
export class AnimationManager {
	constructor(config = {}) {
		this.duration = config.duration || ANIMATION_DURATION / 1000; // Convert to seconds for GSAP
		this.speed = config.speed || 1;
		this.activeAnimations = new Map();
		this.timeline = null;
	}

	/**
	 * Play insert animation
	 * @param {number} bucketIndex
	 * @param {string} key
	 * @param {*} value
	 * @returns {Promise}
	 */
	async playInsertAnimation(bucketIndex, key, _value) {
		const animationId = `insert-${Date.now()}`;
		const duration = this.duration / this.speed;

		return new Promise((resolve) => {
			// Create a timeline for this animation
			const tl = gsap.timeline({
				onComplete: () => {
					this.activeAnimations.delete(animationId);
					resolve({ success: true });
				},
			});

			// Highlight bucket
			const bucketEl = this.#getBucketElement(bucketIndex);
			if (bucketEl) {
				tl.to(
					bucketEl,
					{
						backgroundColor: "#ffeb3b",
						duration: duration * 0.3,
					},
					0,
				);

				// Create item element (simulated)
				const itemEl = document.createElement("div");
				itemEl.className = "hash-item";
				itemEl.textContent = `${key}`;
				itemEl.style.opacity = "0";

				if (bucketEl.querySelector(".bucket-items")) {
					bucketEl.querySelector(".bucket-items").appendChild(itemEl);
				}

				// Animate item appearance
				tl.to(
					itemEl,
					{
						opacity: 1,
						scale: 1,
						duration: duration * 0.5,
					},
					`-=${duration * 0.2}`,
				);
			}

			this.activeAnimations.set(animationId, tl);
		});
	}

	/**
	 * Play search animation
	 * @param {number} bucketIndex
	 * @param {boolean} found
	 * @returns {Promise}
	 */
	async playSearchAnimation(bucketIndex, found) {
		const animationId = `search-${Date.now()}`;
		const duration = this.duration / this.speed;

		return new Promise((resolve) => {
			const tl = gsap.timeline({
				onComplete: () => {
					this.activeAnimations.delete(animationId);
					resolve({ success: true, found });
				},
			});

			const bucketEl = this.#getBucketElement(bucketIndex);
			if (bucketEl) {
				// Pulse animation for search
				const color = found ? "#4caf50" : "#f44336";
				tl.to(bucketEl, {
					backgroundColor: color,
					duration: duration * 0.2,
				});

				tl.to(bucketEl, {
					backgroundColor: "#2d2d2d",
					duration: duration * 0.2,
				});
			}

			this.activeAnimations.set(animationId, tl);
		});
	}

	/**
	 * Play delete animation
	 * @param {number} bucketIndex
	 * @param {string} key
	 * @returns {Promise}
	 */
	async playDeleteAnimation(bucketIndex, key) {
		const animationId = `delete-${Date.now()}`;
		const duration = this.duration / this.speed;

		return new Promise((resolve) => {
			const tl = gsap.timeline({
				onComplete: () => {
					this.activeAnimations.delete(animationId);
					resolve({ success: true });
				},
			});

			const bucketEl = this.#getBucketElement(bucketIndex);
			if (bucketEl) {
				// Highlight bucket in red
				tl.to(bucketEl, {
					backgroundColor: "#f44336",
					duration: duration * 0.3,
				});

				// Find and remove item element
				const itemEls = bucketEl.querySelectorAll(".hash-item");
				for (const itemEl of itemEls) {
					if (itemEl.textContent.includes(String(key))) {
						tl.to(
							itemEl,
							{
								opacity: 0,
								scale: 0,
								duration: duration * 0.3,
							},
							0,
						);

						tl.add(() => {
							itemEl.remove();
						});
						break;
					}
				}

				// Reset color
				tl.to(bucketEl, {
					backgroundColor: "#2d2d2d",
					duration: duration * 0.2,
				});
			}

			this.activeAnimations.set(animationId, tl);
		});
	}

	/**
	 * Highlight bucket animation
	 * @param {number} bucketIndex
	 * @param {number} duration
	 * @returns {Promise}
	 */
	async highlightBucket(bucketIndex, duration = this.duration) {
		const animationId = `highlight-${Date.now()}`;
		const durationSec = duration / this.speed / 1000;

		return new Promise((resolve) => {
			const tl = gsap.timeline({
				onComplete: () => {
					this.activeAnimations.delete(animationId);
					resolve();
				},
			});

			const bucketEl = this.#getBucketElement(bucketIndex);
			if (bucketEl) {
				tl.to(bucketEl, {
					backgroundColor: "#ffeb3b",
					duration: durationSec * 0.4,
				});

				tl.to(bucketEl, {
					backgroundColor: "#2d2d2d",
					duration: durationSec * 0.4,
				});
			}

			this.activeAnimations.set(animationId, tl);
		});
	}

	/**
	 * Set animation speed multiplier
	 * @param {number} speed (0.5, 1, 1.5, 2)
	 */
	setSpeed(speed) {
		this.speed = Math.max(0.1, Math.min(2, speed));

		// Update all active animations
		for (const tl of this.activeAnimations.values()) {
			tl.timeScale(1 / this.speed);
		}
	}

	/**
	 * Pause all animations
	 */
	pauseAll() {
		for (const tl of this.activeAnimations.values()) {
			tl.pause();
		}
	}

	/**
	 * Resume all animations
	 */
	resumeAll() {
		for (const tl of this.activeAnimations.values()) {
			tl.play();
		}
	}

	/**
	 * Cancel all animations
	 */
	cancelAll() {
		for (const tl of this.activeAnimations.values()) {
			tl.kill();
		}
		this.activeAnimations.clear();
	}

	/**
	 * Private Methods
	 */

	/**
	 * Get bucket element from DOM
	 * @param {number} bucketIndex
	 * @returns {HTMLElement|null}
	 */
	#getBucketElement(bucketIndex) {
		return document.querySelector(`.bucket[data-index="${bucketIndex}"]`);
	}
}
