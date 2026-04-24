import { IProduct } from '../../types/index'
import { IEvents } from '../base/Events'

export class Cart {
	protected items: IProduct[] = []

	constructor(protected events: IEvents) {}

	getItems(): IProduct[] {
		return this.items
	}

	addItem(item: IProduct): void {
		if (!this.hasItem(item.id)) {
			this.items.push(item)
			this.events.emit('cart:change')
		}
	}

	removeItem(id: string): void {
		this.items = this.items.filter(el => el.id !== id)
		this.events.emit('cart:change')
	}

	clear(): void {
		this.items = []
		this.events.emit('cart:change')
	}

	getTotalPrice(): number {
		return this.items.reduce((sum, item) => {
			return sum + (item.price || 0)
		}, 0)
	}

	getItemCount(): number {
		return this.items.length
	}

	hasItem(id: string): boolean {
		return this.items.some(item => item.id === id)
	}
}
