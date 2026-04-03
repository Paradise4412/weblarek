import { IProduct } from '../../types/index'

export class ProductCatalog {
	protected items: IProduct[] = []
	protected selected: IProduct | null = null

	constructor(products: IProduct[] = []) {
		this.items = products
	}

	setProducts(products: IProduct[]): void {
		this.items = products
	}

	getProducts(): IProduct[] {
		return this.items
	}

	getProductById(id: string): IProduct | undefined {
		return this.items.find(item => item.id === id)
	}

	setSelectedProduct(product: IProduct | null): void {
		this.selected = product
	}

	getSelectedProduct(): IProduct | null {
		return this.selected
	}
}
