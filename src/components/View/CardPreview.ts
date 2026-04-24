import { IProduct } from '../../types/index'
import { IEvents } from '../base/Events'
import { Card } from './Card'

export class CardPreview extends Card {
	protected productId: string = ''

	constructor(
		container: HTMLElement,
		protected events: IEvents,
	) {
		super(container)

		if (this.button) {
			this.button.addEventListener('click', () => {
				this.events.emit('card:buy', { id: this.productId })
			})
		}
	}

	render(data: IProduct): HTMLElement {
		super.render(data)
		this.productId = data.id

		if (this.button) {
			this.button.textContent = 'В корзину'
			this.button.disabled = !data.price
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
