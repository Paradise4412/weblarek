import { IProduct } from '../../types/index'

export class Cart {
	protected items: IProduct[] = []

	constructor(items: IProduct[] = []) {
		this.items = items
	}

	getItems(): IProduct[] {
		return this.items
	}

	addItem(item: IProduct): void {
		this.items.push(item)
	}

	removeItem(item: IProduct): void {
		this.items = this.items.filter(el => el.id !== item.id)
	}

	clear(): void {
		this.items = []
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
