import { ApiService } from './components/Models/ApiService'
import { BuyerData } from './components/Models/BuyerData'
import { Cart } from './components/Models/Cart'
import { ProductCatalog } from './components/Models/ProductCatalog'
import { Api } from './components/base/Api'
import './scss/styles.scss'
import { apiProducts } from './utils/data'

console.log('ProductCatalog')
const productCatalog = new ProductCatalog()
productCatalog.setProducts(apiProducts.items)
console.log('массив товаров из каталога:', productCatalog.getProducts())
console.log('количество товаров:', productCatalog.getProducts().length)

const selectedProd = productCatalog.getProductById(apiProducts.items[0].id)
productCatalog.setSelectedProduct(selectedProd || null)
console.log('выбранный товар:', productCatalog.getSelectedProduct())

console.log('\nCart')
const cart = new Cart()
console.log('корзина пуста, товаров:', cart.getItemCount())

cart.addItem(apiProducts.items[0])
cart.addItem(apiProducts.items[1])
console.log('после добавления товаров, товаров в корзине:', cart.getItemCount())
console.log('товары в корзине:', cart.getItems())

console.log('проверка наличия товара:', cart.hasItem(apiProducts.items[0].id))
console.log('общая стоимость:', cart.getTotalPrice())

cart.removeItem(apiProducts.items[0])
console.log('после удаления товара, товаров в корзине:', cart.getItemCount())
console.log('нвая общая стоимость:', cart.getTotalPrice())

console.log('\nBuyerData')
const buyer = new BuyerData()
console.log('ошибки валидации пустых данных:', buyer.validate())

buyer.saveBuyerData({
	email: 'test@example.com',
	phone: '89999999999',
	payment: 'card',
})
console.log('после сохранения некоторых данных, ошибки:', buyer.validate())

buyer.saveBuyerData({ address: 'Москва, ул. Тестовая 1' })
console.log('после сохранения полных данных, ошибки:', buyer.validate())
console.log('все данные покупателя:', buyer.getBuyer())

console.log('\nЗагрузка товаров с сервера')
const api = new Api(`${import.meta.env.VITE_API_ORIGIN}/api/weblarek`)
const apiService = new ApiService(api)

apiService
	.getProducts()
	.then(data => {
		console.log('данные с сервера получены, товаров:', data.items.length)
		productCatalog.setProducts(data.items)
		console.log(
			'товары загружены в каталог:',
			productCatalog.getProducts().length,
		)
	})
	.catch(err => console.error('ошибка при загрузке товаров:', err))
