import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export type TBasket = {
	items?: HTMLElement
	total?: number
}

export class Basket extends Component<TBasket> {
	protected list: HTMLElement
	protected button: HTMLButtonElement
	protected price: HTMLElement

	constructor(
		container: HTMLElement,
		protected events: IEvents,
	) {
		super(container)

		this.list = container.querySelector('.basket__list')!
		this.button = container.querySelector('.basket__button')!
		this.price = container.querySelector('.basket__price')!

		this.button.addEventListener('click', () => {
			this.events.emit('basket:checkout')
		})
	}

	set items(value: HTMLElement) {
		this.list.innerHTML = ''
		this.list.appendChild(value)
	}

	set total(value: number) {
		this.price.textContent = value + ' синапсов'
	}
}
