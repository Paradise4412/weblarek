import { CDN_URL, categoryMap } from '../../utils/constants'
import { Card, TCard } from './Card'

export type TCardCatalog = TCard & {
	image?: string
	category?: string
	description?: string
}

export interface ICardCatalogActions {
	onClick: () => void
}

export class CardCatalog extends Card<TCardCatalog> {
	protected cardImage: HTMLImageElement | null
	protected cardCategory: HTMLElement | null
	protected cardDescription: HTMLElement | null

	constructor(container: HTMLElement, actions: ICardCatalogActions) {
		super(container)

		this.cardImage = container.querySelector('.card__image')
		this.cardCategory = container.querySelector('.card__category')
		this.cardDescription = container.querySelector('.card__text')

		this.container.addEventListener('click', actions.onClick)
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

	render(data?: Partial<TCardCatalog>): HTMLElement {
		if (data?.title) this.setTitle(data.title)
		if (data?.image) this.setCardImage(data.image)
		if (data?.category) this.setCardCategory(data.category)
		if (data?.price !== undefined) this.setCardPrice(data.price)
		if (data?.description) this.setCardDescription(data.description)
		return this.container
	}
}
