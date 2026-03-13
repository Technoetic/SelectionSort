class Visualizer {
	#container;
	#bucketContainer;
	#hashPanel;
	#animationEngine;
	#statsPanel;

	constructor(container, animationEngine) {
		this.#container = container;
		this.#animationEngine = animationEngine;
		this.#bucketContainer = document.querySelector(".bucket-array");
		this.#hashPanel = document.querySelector(".hash-computation");
		this.#statsPanel = document.querySelector(".stats-panel");
	}

	renderBuckets(buckets) {
		if (!this.#bucketContainer) return;
		this.#bucketContainer.innerHTML = buckets
			.map(
				(bucket) => `
      <div class="bucket ${bucket.hasCollision ? "collision" : ""} ${!bucket.isEmpty ? "filled" : ""}" data-index="${bucket.index}">
        <div class="chain-container">
          ${
						bucket.items.length === 0
							? '<span class="empty-label">-</span>'
							: bucket.items
									.map(
										(item, i) => `
              <div class="chain-node" data-key="${item.key}" title="Key: ${item.key} / Value: ${item.value}" style="animation-delay: ${i * 0.05}s">
                <span class="node-key">${item.key}</span>
                <span class="node-value">${item.value}</span>
              </div>
            `,
									)
									.join("")
					}
        </div>
        <div class="bucket-index">${bucket.index}</div>
      </div>
    `,
			)
			.join("");
	}

	async showHashComputation(key, hashSteps, finalIndex) {
		if (!this.#hashPanel) return;

		this.#hashPanel.innerHTML = `
      <div class="hash-title">해시 함수 <small>Hash Function</small></div>
      <div class="hash-key">키 <small>Key</small>: "${key}"</div>
      <div class="hash-steps-container"></div>
      <div class="hash-result">
        <span class="hash-formula">hash("${key}") = <strong>${finalIndex}</strong></span>
      </div>
    `;

		const stepsContainer = this.#hashPanel.querySelector(
			".hash-steps-container",
		);

		for (let i = 0; i < hashSteps.length; i++) {
			const step = hashSteps[i];
			const stepEl = document.createElement("div");
			stepEl.className = "hash-step";
			stepEl.innerHTML = `
        <span class="step-char">'${step.char}'</span>
        <span class="step-detail">코드: ${step.charCode} × 위치: ${step.position} = ${step.product}</span>
        <span class="step-running">누적: ${step.runningHash}</span>
      `;
			stepsContainer.appendChild(stepEl);
			await this.#animationEngine.fadeIn(stepEl, 200);
			await this.#animationEngine.delay(100);
		}

		const resultEl = this.#hashPanel.querySelector(".hash-result");
		await this.#animationEngine.bounce(resultEl, 400);
	}

	async highlightBucket(index, color = "#4ecdc4") {
		const bucket = this.#bucketContainer?.querySelector(
			`[data-index="${index}"]`,
		);
		if (!bucket) return;

		bucket.style.borderColor = color;
		bucket.style.boxShadow = `0 0 15px ${color}40`;
		await this.#animationEngine.bounce(bucket, 400);
	}

	async showInsert(index, key, _value, collision) {
		await this.highlightBucket(index, collision ? "#ff6b6b" : "#4ecdc4");

		if (collision) {
			const bucket = this.#bucketContainer?.querySelector(
				`[data-index="${index}"]`,
			);
			if (bucket) {
				await this.#animationEngine.shake(bucket, 400);
			}
		}

		const node = this.#bucketContainer?.querySelector(
			`[data-index="${index}"] [data-key="${key}"]`,
		);
		if (node) {
			await this.#animationEngine.fadeIn(node, 300);
		}
	}

	async showSearch(index, found, _steps) {
		const color = found ? "#00d2d3" : "#ff6b6b";
		await this.highlightBucket(index, color);

		if (!found) {
			const bucket = this.#bucketContainer?.querySelector(
				`[data-index="${index}"]`,
			);
			if (bucket) {
				await this.#animationEngine.shake(bucket, 400);
			}
		}
	}

	async showDelete(index) {
		await this.highlightBucket(index, "#ff9f43");
		await this.#animationEngine.delay(300);
	}

	updateStats(stats) {
		if (!this.#statsPanel) return;
		const loadFactorPercent = (stats.loadFactor * 100).toFixed(1);
		const loadFactorClass =
			stats.loadFactor > 0.75
				? "high"
				: stats.loadFactor > 0.5
					? "medium"
					: "low";

		this.#statsPanel.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">항목 <small>Entry</small></span>
        <span class="stat-value">${stats.total}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">테이블 크기</span>
        <span class="stat-value">${stats.tableSize}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">로드 팩터</span>
        <span class="stat-value load-factor ${loadFactorClass}">${loadFactorPercent}%</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">충돌 버킷</span>
        <span class="stat-value">${stats.collisionCount}</span>
      </div>
    `;
	}

	resetHighlights() {
		this.#bucketContainer?.querySelectorAll(".bucket").forEach((el) => {
			el.style.borderColor = "";
			el.style.boxShadow = "";
		});
	}

	clearHashPanel() {
		if (this.#hashPanel) {
			this.#hashPanel.innerHTML = `
        <div class="hash-title">해시 함수 <small>Hash Function</small></div>
        <div class="hash-placeholder">연산을 수행하면 여기에 과정이 표시됩니다</div>
      `;
		}
	}
}
