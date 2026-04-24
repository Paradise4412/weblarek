import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export type TSuccess = {
	total?: number
}

export class SuccessView extends Component<TSuccess> {
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

	set total(value: number) {
		this.description.textContent = `Списано ${value} синапсов`
	}
}
