import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export class SuccessView extends Component<{ total: number }> {
	protected closeBtn: HTMLButtonElement
	protected description: HTMLElement

	constructor(
		container: HTMLElement,
		protected events: IEvents,
	) {
		super(container)

		this.closeBtn = container.querySelector('.order-success__close')!
		this.description = container.querySelector('.order-success__description')!

		this.closeBtn.addEventListener('click', () => {
			this.events.emit('success:close')
		})
	}

	render(data: { total: number }): HTMLElement {
		this.description.textContent = `Списано ${data.total} синапсов`
		return this.container
	}
}
