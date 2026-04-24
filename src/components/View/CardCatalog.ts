import { Card, TCard } from './Card'

export type TCardCatalog = TCard

export interface ICardCatalogActions {
	onClick: () => void
}

export class CardCatalog extends Card<TCardCatalog> {
	constructor(container: HTMLElement, actions: ICardCatalogActions) {
		super(container)
		this.container.addEventListener('click', actions.onClick)
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
