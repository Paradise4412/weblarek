import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export type THeader = {
	count?: number
}

export class Header extends Component<THeader> {
	protected basketButton: HTMLButtonElement
	protected counter: HTMLElement

	constructor(
		container: HTMLElement,
		protected events: IEvents,
	) {
		super(container)

		this.basketButton = container.querySelector('.header__basket')!
		this.counter = container.querySelector('.header__basket-counter')!

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open')
		})
	}

	set count(value: number) {
		this.counter.textContent = String(value)
	}
}
