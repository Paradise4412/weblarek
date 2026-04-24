import { IProduct } from '../../types/index'
import { CDN_URL, categoryMap } from '../../utils/constants'
import { Component } from '../base/Component'

export class Card extends Component<IProduct> {
	protected title: HTMLElement | null
	protected image: HTMLImageElement | null
	protected description?: HTMLElement | null
	protected category?: HTMLElement | null
	protected price: HTMLElement | null
	protected button?: HTMLButtonElement | null
	protected text?: HTMLElement | null

	constructor(
		container: HTMLElement,
		protected onCardSelect?: (id: string) => void,
	) {
		super(container)

		this.title = container.querySelector('.card__title')
		this.image = container.querySelector('.card__image')
		this.category = container.querySelector('.card__category')
		this.price = container.querySelector('.card__price')
		this.button = container.querySelector('.card__button')
		this.description = container.querySelector('.card__text')
	}

	render(data: IProduct): HTMLElement {
		if (this.title) this.title.textContent = data.title
		if (this.image) this.setImage(this.image, CDN_URL + '/' + data.image)
		if (this.price)
			this.price.textContent = data.price
				? data.price + ' синапсов'
				: 'Недоступно'

		if (this.category) {
			const categoryClass =
				categoryMap[data.category as keyof typeof categoryMap]
			this.category.className = 'card__category'
			if (categoryClass) {
				this.category.classList.add(categoryClass)
			}
			this.category.textContent = data.category
		}

		if (this.description) {
			this.description.textContent = data.description
		}

		if (this.button && this.onCardSelect) {
			this.button.addEventListener('click', () => {
				this.onCardSelect!(data.id)
			})
		}

		return this.container
	}
}
