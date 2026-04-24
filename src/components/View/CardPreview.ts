import { Card, TCard } from './Card'

export type TCardPreview = TCard & {
	buttonText?: string
}

export interface ICardPreviewActions {
	onClick: () => void
}

export class CardPreview extends Card<TCardPreview> {
	constructor(container: HTMLElement, actions: ICardPreviewActions) {
		super(container)

		if (this.button) {
			this.button.addEventListener('click', actions.onClick)
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
