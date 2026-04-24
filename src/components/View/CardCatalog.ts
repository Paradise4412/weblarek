import { IProduct } from '../../types/index'
import { IEvents } from '../base/Events'
import { Card } from './Card'

export class CardCatalog extends Card {
	protected productId: string = ''

	constructor(
		container: HTMLElement,
		protected events: IEvents,
	) {
		super(container)

		this.container.addEventListener('click', () => {
			this.events.emit('card:select', { id: this.productId })
		})
	}

	render(data: IProduct): HTMLElement {
		super.render(data)
		this.productId = data.id
		return this.container
	}
}
