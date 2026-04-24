import { IProduct } from '../../types/index'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export class Basket extends Component<IProduct[]> {
	protected list: HTMLElement
	protected button: HTMLButtonElement
	protected price: HTMLElement

	constructor(
		container: HTMLElement,
		protected events: IEvents,
	) {
		super(container)

		this.list = container.querySelector('.basket__list')!
		this.button = container.querySelector('.basket__button')!
		this.price = container.querySelector('.basket__price')!

		this.button.addEventListener('click', () => {
			this.events.emit('basket:checkout')
		})
	}

	render(data: IProduct[]): HTMLElement {
		this.list.innerHTML = ''

		if (data.length === 0) {
			this.list.innerHTML =
				'<p style="text-align: center; padding: 20px;">Корзина пуста</p>'
			this.button.disabled = true
		} else {
			this.button.disabled = false
			data.forEach((item, index) => {
				const li = document.createElement('li')
				li.className = 'basket__item card card_compact'
				li.innerHTML = `
					<span class="basket__item-index">${index + 1}</span>
					<span class="card__title">${item.title}</span>
					<span class="card__price">${item.price} синапсов</span>
					<button class="basket__item-delete card__button" aria-label="удалить"></button>
				`

				const deleteBtn = li.querySelector('.basket__item-delete')
				deleteBtn?.addEventListener('click', () => {
					this.events.emit('basket:remove', { id: item.id })
				})

				this.list.appendChild(li)
			})
		}

		const total = data.reduce((sum, item) => sum + (item.price || 0), 0)
		this.price.textContent = total + ' синапсов'

		return this.container
	}
}
