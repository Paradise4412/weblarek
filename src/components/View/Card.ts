import { CDN_URL, categoryMap } from '../../utils/constants'
import { Component } from '../base/Component'

export type TCard = {
	title?: string
	image?: string
	category?: string
	price?: number | null
	description?: string
}

export class Card<T extends TCard = TCard> extends Component<T> {
	protected cardTitle: HTMLElement | null
	protected cardImage: HTMLImageElement | null
	protected cardDescription?: HTMLElement | null
	protected cardCategory?: HTMLElement | null
	protected cardPrice: HTMLElement | null
	protected button?: HTMLButtonElement | null

	constructor(container: HTMLElement) {
		super(container)

		this.cardTitle = container.querySelector('.card__title')
		this.cardImage = container.querySelector('.card__image')
		this.cardCategory = container.querySelector('.card__category')
		this.cardPrice = container.querySelector('.card__price')
		this.button = container.querySelector('.card__button')
		this.cardDescription = container.querySelector('.card__text')
	}

	protected setTitle(value: string): void {
		if (this.cardTitle) this.cardTitle.textContent = value
	}

	protected setCardImage(value: string): void {
		if (this.cardImage) {
			this.cardImage.src = CDN_URL + '/' + value
		}
	}

	protected setCardCategory(value: string): void {
		if (this.cardCategory) {
			const categoryClass = categoryMap[value as keyof typeof categoryMap]
			this.cardCategory.className = 'card__category'
			if (categoryClass) {
				this.cardCategory.classList.add(categoryClass)
			}
			this.cardCategory.textContent = value
		}
	}

	protected setCardPrice(value: number | null): void {
		if (this.cardPrice)
			this.cardPrice.textContent = value ? value + ' синапсов' : 'Недоступно'
	}

	protected setCardDescription(value: string): void {
		if (this.cardDescription) {
			this.cardDescription.textContent = value
		}
	}
}
