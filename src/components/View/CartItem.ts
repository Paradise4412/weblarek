import { Card, TCard } from './Card'

export type TCartItem = TCard & {
	index?: number
}

export interface ICartItemActions {
	onDelete: () => void
}

export class CartItem extends Card<TCartItem> {
	protected indexElement: HTMLElement | null

	constructor(container: HTMLElement, actions: ICartItemActions) {
		super(container)
		this.indexElement = container.querySelector('.basket__item-index')
		const deleteBtn = container.querySelector('.basket__item-delete')
		deleteBtn?.addEventListener('click', actions.onDelete)
	}

	render(data?: Partial<TCartItem>): HTMLElement {
		if (data?.title) this.setTitle(data.title)
		if (data?.price !== undefined) this.setCardPrice(data.price)
		if (data?.index) {
			if (this.indexElement) {
				this.indexElement.textContent = String(data.index)
			}
		}
		return this.container
	}
}
