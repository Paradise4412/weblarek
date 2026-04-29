import { Component } from '../base/Component'

export type TCard = {
	title?: string
	price?: number | null
}

export class Card<T extends TCard = TCard> extends Component<T> {
	protected cardTitle: HTMLElement
	protected cardPrice: HTMLElement

	constructor(container: HTMLElement) {
		super(container)

		const cardTitle = container.querySelector('.card__title')
		const cardPrice = container.querySelector('.card__price')

		if (!cardTitle || !cardPrice) {
			throw new Error('Card: missing required elements')
		}

		this.cardTitle = cardTitle as HTMLElement
		this.cardPrice = cardPrice as HTMLElement
	}

	protected setTitle(value: string): void {
		this.cardTitle.textContent = value
	}

	protected setCardPrice(value: number | null): void {
		this.cardPrice.textContent = value ? value + ' синапсов' : 'Недоступно'
	}
}
