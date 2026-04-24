import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export class Header extends Component<{ count: number }> {
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

	render(data: { count: number }): HTMLElement {
		this.counter.textContent = String(data.count)
		return this.container
	}
}
