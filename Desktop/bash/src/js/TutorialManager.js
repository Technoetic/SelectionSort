class TutorialManager {
	#steps;
	#currentIndex;
	#container;
	#onStepChange;

	static STEPS = [
		{
			title: "1. 해시 함수란?",
			description:
				"해시 함수는 데이터(키)를 고정 크기의 숫자(인덱스)로 변환하는 함수입니다. 전화번호부에서 이름을 입력하면 해시 함수가 그 이름을 저장할 위치(버킷 번호)로 바꿔줍니다.",
			action: "demo-hash",
			highlight: ".hash-computation",
			example:
				'예: "홍길동" → 각 글자의 코드값 합산 → 7로 나눈 나머지 → 버킷 3번',
			tip: '💡 오른쪽 "해시 계산 과정" 패널에서 변환 과정을 확인하세요!',
		},
		{
			title: "2. 첫 번째 연락처 추가",
			description:
				"insert 연산으로 해시테이블에 데이터를 저장합니다. 이름을 해시하여 인덱스를 구하고, 해당 버킷에 (이름, 전화번호) 쌍을 저장합니다.",
			action: "try-insert",
			highlight: ".contact-form",
			example:
				'이름에 "김철수", 전화번호에 "010-1234-5678"을 입력하고 추가 버튼을 누르세요.',
			tip: "💡 버킷 배열에서 데이터가 저장되는 과정을 관찰하세요!",
		},
		{
			title: "3. 여러 연락처 추가",
			description:
				"연락처를 더 추가하여 해시테이블이 채워지는 모습을 관찰합니다. 각 이름마다 다른 버킷에 저장되는 것을 확인하세요.",
			action: "try-multiple-insert",
			highlight: ".bucket-array",
			example: "3~4개의 연락처를 추가해 보세요. 버킷이 점점 채워집니다.",
			tip: "💡 로드 팩터(적재율)가 올라가는 것을 상단에서 확인하세요!",
		},
		{
			title: "4. 연락처 검색 O(1)",
			description:
				"search 연산은 해시 함수로 바로 올바른 버킷을 찾습니다. 배열을 처음부터 끝까지 탐색할 필요가 없어 평균 O(1) 시간에 검색됩니다.",
			action: "try-search",
			highlight: ".contact-form .search-btn",
			example: "추가한 연락처의 이름을 입력하고 검색 버튼을 누르세요.",
			tip: "💡 검색 시 방문하는 버킷 수(단계)를 확인하세요!",
		},
		{
			title: "5. 충돌이란?",
			description:
				"서로 다른 키가 같은 해시 값(같은 버킷)을 가질 때 충돌이 발생합니다. 해시테이블의 크기가 제한적이므로 충돌은 불가피합니다.",
			action: "demo-collision",
			highlight: ".bucket-array",
			example: "같은 버킷에 저장되는 이름을 추가하면 충돌이 발생합니다!",
			tip: "💡 충돌이 발생하면 버킷이 빨간색으로 깜빡입니다.",
		},
		{
			title: "6. 체이닝으로 충돌 해결",
			description:
				"체이닝(Chaining)은 같은 버킷에 연결 리스트로 여러 항목을 저장하는 방식입니다. 충돌이 발생해도 체인에 노드를 추가하면 됩니다.",
			action: "demo-chaining",
			highlight: ".bucket-array",
			example:
				"충돌이 발생한 버킷을 보면 여러 항목이 체인처럼 연결되어 있습니다.",
			tip: "💡 체인이 길어지면 검색 시간이 O(n)으로 늘어날 수 있습니다.",
		},
		{
			title: "7. 연락처 삭제",
			description:
				"delete 연산은 해시로 버킷을 찾고, 체인에서 해당 항목을 제거합니다. 삭제 후에도 같은 버킷의 다른 항목들은 유지됩니다.",
			action: "try-delete",
			highlight: ".contact-form .delete-btn",
			example: "삭제할 이름을 입력하고 삭제 버튼을 누르세요.",
			tip: "💡 삭제 후 버킷의 체인이 어떻게 변하는지 관찰하세요!",
		},
		{
			title: "8. 로드 팩터와 리사이징",
			description:
				"로드 팩터 = 항목 수 / 테이블 크기. 로드 팩터가 너무 높으면(보통 0.75) 충돌이 많아져 성능이 저하됩니다. 이때 테이블 크기를 늘리고 모든 항목을 재해싱합니다.",
			action: "demo-resize",
			highlight: ".control-panel",
			example: "상단 컨트롤에서 테이블 크기를 변경하면 리사이징이 발생합니다.",
			tip: "🎉 축하합니다! 해시테이블의 핵심 개념을 모두 배웠습니다!",
		},
	];

	constructor(container, onStepChange = null) {
		this.#steps = TutorialManager.STEPS;
		this.#currentIndex = 0;
		this.#container = container;
		this.#onStepChange = onStepChange;
	}

	getCurrentStep() {
		return this.#steps[this.#currentIndex];
	}

	getCurrentIndex() {
		return this.#currentIndex;
	}

	goToStep(index) {
		if (index >= 0 && index < this.#steps.length) {
			this.#currentIndex = index;
			this.render();
			if (this.#onStepChange) this.#onStepChange(this.getCurrentStep(), index);
		}
	}

	next() {
		if (this.#currentIndex < this.#steps.length - 1) {
			this.goToStep(this.#currentIndex + 1);
		}
	}

	prev() {
		if (this.#currentIndex > 0) {
			this.goToStep(this.#currentIndex - 1);
		}
	}

	isComplete() {
		return this.#currentIndex === this.#steps.length - 1;
	}

	getProgress() {
		return {
			current: this.#currentIndex + 1,
			total: this.#steps.length,
			percent: Math.round(
				((this.#currentIndex + 1) / this.#steps.length) * 100,
			),
		};
	}

	render() {
		if (!this.#container) return;
		const step = this.getCurrentStep();
		const progress = this.getProgress();

		this.#container.innerHTML = `
      <div class="tutorial-header">
        <div class="tutorial-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress.percent}%"></div>
          </div>
          <span class="progress-text">${progress.current} / ${progress.total}</span>
        </div>
        <h3 class="tutorial-title">${step.title}</h3>
      </div>
      <div class="tutorial-body">
        <p class="tutorial-desc">${step.description}</p>
        <div class="tutorial-example">${step.example}</div>
        <div class="tutorial-tip">${step.tip}</div>
      </div>
      <div class="tutorial-nav">
        <button class="tutorial-prev-btn" ${this.#currentIndex === 0 ? "disabled" : ""}>← 이전</button>
        <div class="tutorial-dots">
          ${this.#steps.map((_, i) => `<span class="dot ${i === this.#currentIndex ? "active" : ""}" data-step="${i}"></span>`).join("")}
        </div>
        <button class="tutorial-next-btn" ${this.isComplete() ? "disabled" : ""}>다음 →</button>
      </div>
    `;

		// 이벤트 바인딩
		this.#container
			.querySelector(".tutorial-prev-btn")
			?.addEventListener("click", () => this.prev());
		this.#container
			.querySelector(".tutorial-next-btn")
			?.addEventListener("click", () => this.next());
		this.#container.querySelectorAll(".dot").forEach((dot) => {
			dot.addEventListener("click", () =>
				this.goToStep(parseInt(dot.dataset.step, 10)),
			);
		});
	}
}
