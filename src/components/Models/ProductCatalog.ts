import { IProduct } from '../../types/index'
import { IEvents } from '../base/Events'

export class ProductCatalog {
	protected items: IProduct[] = []
	protected selected: IProduct | null = null

	constructor(protected events: IEvents) {}

	setProducts(products: IProduct[]): void {
		this.items = products
		this.events.emit('catalog:change')
	}

	getProducts(): IProduct[] {
		return this.items
	}

	getProductById(id: string): IProduct | undefined {
		return this.items.find(item => item.id === id)
	}

	setSelectedProduct(product: IProduct | null): void {
		this.selected = product
		this.events.emit('product:selected', { product })
	}

	getSelectedProduct(): IProduct | null {
		return this.selected
	}
}
