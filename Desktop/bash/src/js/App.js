class App {
	#hashTable;
	#contactBook;
	#visualizer;
	#animationEngine;
	#elements;

	constructor() {
		this.#hashTable = new HashTable(7);
		this.#contactBook = new ContactBook(this.#hashTable);
		this.#animationEngine = new AnimationEngine();
	}

	init() {
		this.#elements = {
			form: document.getElementById("contact-form"),
			nameInput: document.getElementById("input-name"),
			phoneInput: document.getElementById("input-phone"),
			searchBtn: document.getElementById("btn-search"),
			deleteBtn: document.getElementById("btn-delete"),
			contactList: document.getElementById("contact-list"),
			notification: document.getElementById("notification"),
			visualizerPanel: document.querySelector(".bucket-panel"),
			sizeSelect: document.getElementById("table-size"),
			speedSlider: document.getElementById("speed-slider"),
			speedValue: document.getElementById("speed-value"),
			resetBtn: document.getElementById("btn-reset"),
			sampleBtn: document.getElementById("btn-sample"),
		};

		this.#visualizer = new Visualizer(
			this.#elements.visualizerPanel,
			this.#animationEngine,
		);

		this.bindEvents();
		this.updateView();
	}

	bindEvents() {
		this.#elements.form?.addEventListener("submit", (e) => {
			e.preventDefault();
			this.handleInsert();
		});

		this.#elements.searchBtn?.addEventListener("click", () =>
			this.handleSearch(),
		);
		this.#elements.deleteBtn?.addEventListener("click", () =>
			this.handleDelete(),
		);

		this.#elements.sizeSelect?.addEventListener("change", (e) => {
			const newSize = parseInt(e.target.value, 10);
			this.handleResize(newSize);
		});

		this.#elements.speedSlider?.addEventListener("input", (e) => {
			const speed = parseFloat(e.target.value);
			this.#animationEngine.setSpeed(speed);
			if (this.#elements.speedValue) {
				this.#elements.speedValue.textContent = `${speed}x`;
			}
		});

		this.#elements.resetBtn?.addEventListener("click", () =>
			this.handleReset(),
		);
		this.#elements.sampleBtn?.addEventListener("click", () =>
			this.handleSampleData(),
		);

		document.addEventListener("keydown", (e) => {
			if (e.key === "Enter" && e.ctrlKey) {
				this.handleInsert();
			}
		});
	}

	async handleInsert() {
		const name = this.#elements.nameInput?.value.trim();
		const phone = this.#elements.phoneInput?.value.trim();

		if (!name || !phone) {
			this.showNotification("이름과 전화번호를 모두 입력하세요.", "error");
			return;
		}

		this.#visualizer.resetHighlights();
		const result = this.#contactBook.addContact(name, phone);

		if (result.success) {
			await this.#visualizer.showHashComputation(
				name,
				result.hashSteps,
				result.index,
			);
			this.updateView();
			await this.#visualizer.showInsert(
				result.index,
				name,
				phone,
				result.collision,
			);

			if (result.updated) {
				this.showNotification(`"${name}" 연락처가 업데이트되었습니다.`, "info");
			} else if (result.collision) {
				this.showNotification(
					`충돌 발생! "${name}"이(가) 버킷 ${result.index}에 체이닝되었습니다.`,
					"warning",
				);
			} else {
				this.showNotification(
					`"${name}"이(가) 버킷 ${result.index}에 저장되었습니다.`,
					"success",
				);
			}

			this.#elements.nameInput.value = "";
			this.#elements.phoneInput.value = "";
			this.#elements.nameInput.focus();
		} else {
			this.showNotification(result.error, "error");
		}
	}

	async handleSearch() {
		const name = this.#elements.nameInput?.value.trim();
		if (!name) {
			this.showNotification("검색할 이름을 입력하세요.", "error");
			return;
		}

		this.#visualizer.resetHighlights();
		const result = this.#contactBook.findContact(name);

		if (result.success) {
			await this.#visualizer.showHashComputation(
				name,
				result.hashSteps,
				result.index,
			);
			await this.#visualizer.showSearch(
				result.index,
				result.found,
				result.steps,
			);

			if (result.found) {
				this.showNotification(
					`"${name}" 발견! 전화번호: ${result.value} (${result.steps}단계)`,
					"success",
				);
				this.#elements.phoneInput.value = result.value;
			} else {
				this.showNotification(
					`"${name}"을(를) 찾을 수 없습니다. (${result.steps}단계 탐색)`,
					"error",
				);
			}
		}
	}

	async handleDelete() {
		const name = this.#elements.nameInput?.value.trim();
		if (!name) {
			this.showNotification("삭제할 이름을 입력하세요.", "error");
			return;
		}

		this.#visualizer.resetHighlights();
		const result = this.#contactBook.removeContact(name);

		if (result.success) {
			await this.#visualizer.showHashComputation(
				name,
				result.hashSteps,
				result.index,
			);

			if (result.deleted) {
				await this.#visualizer.showDelete(result.index);
				this.updateView();
				this.showNotification(`"${name}"이(가) 삭제되었습니다.`, "success");
				this.#elements.nameInput.value = "";
				this.#elements.phoneInput.value = "";
			} else {
				this.showNotification(`"${name}"을(를) 찾을 수 없습니다.`, "error");
			}
		}
	}

	handleResize(newSize) {
		this.#hashTable.resize(newSize);
		this.updateView();
		this.showNotification(
			`테이블 크기가 ${newSize}으로 변경되었습니다. 모든 항목이 재해싱되었습니다.`,
			"info",
		);
	}

	handleReset() {
		this.#hashTable.clear();
		this.#visualizer.clearHashPanel();
		this.updateView();
		this.showNotification("테이블이 초기화되었습니다.", "info");
	}

	async handleSampleData() {
		const samples = [
			{ name: "홍길동", phone: "010-1234-5678" },
			{ name: "김철수", phone: "010-2345-6789" },
			{ name: "이영희", phone: "010-3456-7890" },
			{ name: "박민수", phone: "010-4567-8901" },
			{ name: "정수진", phone: "010-5678-9012" },
		];

		for (const { name, phone } of samples) {
			const result = this.#contactBook.addContact(name, phone);
			if (result.success) {
				this.updateView();
				await this.#animationEngine.delay(300);
			}
		}
		this.showNotification("샘플 데이터 5개가 추가되었습니다.", "success");
	}

	updateView() {
		const stats = this.#contactBook.getStats();
		this.#visualizer.renderBuckets(stats.buckets);
		this.#visualizer.updateStats(stats);
		this.renderContactList();
	}

	renderContactList() {
		const contacts = this.#contactBook.getAllContacts();
		if (!this.#elements.contactList) return;

		if (contacts.length === 0) {
			this.#elements.contactList.innerHTML = `
        <div class="empty-contacts">
          <span class="empty-icon">📱</span>
          <p>연락처가 없습니다</p>
          <p class="empty-hint">위 폼에서 연락처를 추가하세요</p>
        </div>
      `;
			return;
		}

		this.#elements.contactList.innerHTML = contacts
			.map(
				(c) => `
      <div class="contact-card" data-name="${c.key}">
        <div class="contact-avatar">${c.key[0]}</div>
        <div class="contact-info">
          <span class="contact-name">${c.key}</span>
          <span class="contact-phone">${c.value}</span>
        </div>
        <span class="contact-bucket" title="버킷 ${c.index}">#${c.index}</span>
      </div>
    `,
			)
			.join("");

		this.#elements.contactList
			.querySelectorAll(".contact-card")
			.forEach((card) => {
				card.addEventListener("click", () => {
					const name = card.dataset.name;
					this.#elements.nameInput.value = name;
					const result = this.#contactBook.findContact(name);
					if (result.found) {
						this.#elements.phoneInput.value = result.value;
					}
				});
			});
	}

	showNotification(message, type = "info") {
		const el = this.#elements.notification;
		if (!el) return;

		const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
		el.innerHTML = `<span class="notif-icon">${icons[type] || ""}</span> ${message}`;
		el.className = `notification ${type} show`;

		setTimeout(() => {
			el.classList.remove("show");
		}, 3000);
	}

}

document.addEventListener("DOMContentLoaded", () => {
	const app = new App();
	app.init();
});
