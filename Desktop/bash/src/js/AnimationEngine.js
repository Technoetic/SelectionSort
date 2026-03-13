class AnimationEngine {
	#speed;
	#queue;
	#isPlaying;
	#isPaused;

	constructor() {
		this.#speed = 1;
		this.#queue = [];
		this.#isPlaying = false;
		this.#isPaused = false;
	}

	setSpeed(speed) {
		this.#speed = Math.max(0.25, Math.min(3, speed));
	}

	getSpeed() {
		return this.#speed;
	}

	getDuration(baseDuration) {
		return baseDuration / this.#speed;
	}

	async animate(element, keyframes, duration, options = {}) {
		if (!element) return;
		const animation = element.animate(keyframes, {
			duration: this.getDuration(duration),
			easing: options.easing || "ease-in-out",
			fill: options.fill || "forwards",
			...options,
		});
		return animation.finished;
	}

	async fadeIn(element, duration = 300) {
		if (!element) return;
		element.style.display = "";
		return this.animate(
			element,
			[
				{ opacity: 0, transform: "scale(0.8)" },
				{ opacity: 1, transform: "scale(1)" },
			],
			duration,
		);
	}

	async fadeOut(element, duration = 300) {
		if (!element) return;
		await this.animate(
			element,
			[
				{ opacity: 1, transform: "scale(1)" },
				{ opacity: 0, transform: "scale(0.8)" },
			],
			duration,
		);
	}

	async highlight(element, color, duration = 500) {
		if (!element) return;
		const originalBg = element.style.backgroundColor;
		return this.animate(
			element,
			[
				{ backgroundColor: color, transform: "scale(1.05)" },
				{ backgroundColor: color, transform: "scale(1.05)", offset: 0.7 },
				{ backgroundColor: originalBg || "transparent", transform: "scale(1)" },
			],
			duration,
		);
	}

	async bounce(element, duration = 400) {
		if (!element) return;
		return this.animate(
			element,
			[
				{ transform: "translateY(0)" },
				{ transform: "translateY(-10px)" },
				{ transform: "translateY(0)" },
				{ transform: "translateY(-5px)" },
				{ transform: "translateY(0)" },
			],
			duration,
		);
	}

	async shake(element, duration = 400) {
		if (!element) return;
		return this.animate(
			element,
			[
				{ transform: "translateX(0)" },
				{ transform: "translateX(-8px)" },
				{ transform: "translateX(8px)" },
				{ transform: "translateX(-4px)" },
				{ transform: "translateX(4px)" },
				{ transform: "translateX(0)" },
			],
			duration,
		);
	}

	async slideIn(element, direction = "left", duration = 400) {
		if (!element) return;
		const transforms = {
			left: ["translateX(-30px)", "translateX(0)"],
			right: ["translateX(30px)", "translateX(0)"],
			top: ["translateY(-30px)", "translateY(0)"],
			bottom: ["translateY(30px)", "translateY(0)"],
		};
		const [from, to] = transforms[direction] || transforms.left;
		return this.animate(
			element,
			[
				{ opacity: 0, transform: from },
				{ opacity: 1, transform: to },
			],
			duration,
		);
	}

	async delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, this.getDuration(ms)));
	}

	queue(animationFn) {
		this.#queue.push(animationFn);
	}

	async playAll() {
		this.#isPlaying = true;
		this.#isPaused = false;
		for (const fn of this.#queue) {
			if (!this.#isPlaying) break;
			while (this.#isPaused) {
				await new Promise((r) => setTimeout(r, 100));
			}
			await fn();
		}
		this.#queue = [];
		this.#isPlaying = false;
	}

	pause() {
		this.#isPaused = true;
	}
	resume() {
		this.#isPaused = false;
	}
	stop() {
		this.#isPlaying = false;
		this.#isPaused = false;
		this.#queue = [];
	}
	isPlaying() {
		return this.#isPlaying;
	}
}
