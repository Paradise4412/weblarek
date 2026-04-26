import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export class Modal extends Component<object> {
	protected closeButton: HTMLButtonElement
	protected content: HTMLElement

	constructor(
		container: HTMLElement,
		protected events: IEvents,
	) {
		super(container)

		this.closeButton = container.querySelector('.modal__close')!
		this.content = container.querySelector('.modal__content')!

		this.closeButton.addEventListener('click', () => this.close())
		this.container.addEventListener('click', e => {
			if (e.target === this.container) {
				this.close()
			}
		})
	}

	open(): void {
		this.container.classList.add('modal_active')
		document.body.style.overflow = 'hidden'
	}

	close(): void {
		this.container.classList.remove('modal_active')
		this.content.innerHTML = ''
		document.body.style.overflow = ''
	}

	set modalContent(value: HTMLElement) {
		this.content.innerHTML = ''
		this.content.appendChild(value)
	}
}
