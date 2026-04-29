import { CDN_URL, categoryMap } from '../../utils/constants'
import { Card, TCard } from './Card'

export type TCardPreview = TCard & {
	image?: string
	category?: string
	description?: string
	buttonText?: string
}

export interface ICardPreviewActions {
	onClick: () => void
}

export class CardPreview extends Card<TCardPreview> {
	protected cardImage: HTMLImageElement | null
	protected cardCategory: HTMLElement | null
	protected cardDescription: HTMLElement | null
	protected button: HTMLButtonElement | null

	constructor(container: HTMLElement, actions: ICardPreviewActions) {
		super(container)

		this.cardImage = container.querySelector('.card__image')
		this.cardCategory = container.querySelector('.card__category')
		this.cardDescription = container.querySelector('.card__text')
		this.button = container.querySelector('.card__button')

		if (this.button) {
			this.button.addEventListener('click', actions.onClick)
		}
	}

	private setCardImage(value: string): void {
		if (this.cardImage) {
			this.cardImage.src = CDN_URL + '/' + value
		}
	}

	private setCardCategory(value: string): void {
		if (this.cardCategory) {
			const categoryClass = categoryMap[value as keyof typeof categoryMap]
			this.cardCategory.className = 'card__category'
			if (categoryClass) {
				this.cardCategory.classList.add(categoryClass)
			}
			this.cardCategory.textContent = value
		}
	}

	private setCardDescription(value: string): void {
		if (this.cardDescription) {
			this.cardDescription.textContent = value
		}
	}

	render(data?: Partial<TCardPreview>): HTMLElement {
		if (data?.title) this.setTitle(data.title)
		if (data?.image) this.setCardImage(data.image)
		if (data?.category) this.setCardCategory(data.category)
		if (data?.price !== undefined) this.setCardPrice(data.price)
		if (data?.description) this.setCardDescription(data.description)

		if (this.button) {
			this.button.textContent = 'В корзину'
			this.button.disabled = data?.price === null || data?.price === undefined
		}

		return this.container
	}

	setButtonState(inCart: boolean, noPrice: boolean): void {
		if (this.button) {
			if (noPrice) {
				this.button.textContent = 'Недоступно'
				this.button.disabled = true
			} else if (inCart) {
				this.button.textContent = 'Удалить из корзины'
				this.button.disabled = false
			} else {
				this.button.textContent = 'В корзину'
				this.button.disabled = false
			}
		}
	}
}
