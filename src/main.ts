import { Api } from './components/base/Api'
import { EventEmitter } from './components/base/Events'
import { ApiService } from './components/Models/ApiService'
import { BuyerData } from './components/Models/BuyerData'
import { Cart } from './components/Models/Cart'
import { ProductCatalog } from './components/Models/ProductCatalog'
import { Basket } from './components/View/Basket'
import { CardCatalog } from './components/View/CardCatalog'
import { CardPreview } from './components/View/CardPreview'
import { CartItem } from './components/View/CartItem'
import { ContactsForm } from './components/View/ContactsForm'
import { Gallery } from './components/View/Gallery'
import { Header } from './components/View/Header'
import { Modal } from './components/View/Modal'
import { OrderForm } from './components/View/OrderForm'
import { SuccessView } from './components/View/SuccessView'
import './scss/styles.scss'
import { API_URL } from './utils/constants'

const events = new EventEmitter()

const productCatalog = new ProductCatalog(events)
const cart = new Cart(events)
const buyer = new BuyerData(events)

const api = new Api(API_URL)
const apiService = new ApiService(api)

const modalElement = document.getElementById('modal-container')!
const modal = new Modal(modalElement, events)

const headerElement = document.querySelector('.header') as HTMLElement
const header = new Header(headerElement, events)

const galleryElement = document.querySelector('.gallery') as HTMLElement
const gallery = new Gallery(galleryElement)

const cardCatalogTemplate = document.querySelector(
	'#card-catalog',
) as HTMLTemplateElement
const cartItemTemplate = document.querySelector(
	'#basket-item',
) as HTMLTemplateElement
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement
const contactsTemplate = document.querySelector(
	'#contacts',
) as HTMLTemplateElement
const successTemplate = document.querySelector(
	'#success',
) as HTMLTemplateElement

let currentStep = 1

let basket: Basket | null = null
let orderForm: OrderForm | null = null
let contactsForm: ContactsForm | null = null
let successView: SuccessView | null = null

events.on('catalog:change', () => {
	const products = productCatalog.getProducts()
	const cardElements = products.map(product => {
		const cardTemplate = cardCatalogTemplate.content.cloneNode(
			true,
		) as HTMLElement
		const cardElement = cardTemplate.querySelector('.card') as HTMLElement
		const cardView = new CardCatalog(cardElement, {
			onClick: () => {
				events.emit('card:select', { id: product.id })
			},
		})

		cardView.render({
			title: product.title,
			image: product.image,
			category: product.category,
			price: product.price,
			description: product.description,
		})

		return cardElement
	})

	gallery.render({ items: cardElements })
})

events.on('card:select', (data: { id: string }) => {
	const product = productCatalog.getProductById(data.id)
	if (product) {
		productCatalog.setSelectedProduct(product)
	}
})

events.on('product:selected', () => {
	const product = productCatalog.getSelectedProduct()
	if (product) {
		const modalContent = modal.modalContent
		if (modalContent && modalContent.querySelector('.card_full')) {
			const inCart = cart.hasItem(product.id)
			const cardElement = modalContent.querySelector('.card') as HTMLElement
			const cardPreview = new CardPreview(cardElement, {
				onClick: () => {
					events.emit('card:buy', { id: product.id })
				},
			})
			cardPreview.setButtonState(inCart, !product.price)
		}
	}
})

events.on('card:buy', (data: { id: string }) => {
	const product = productCatalog.getProductById(data.id)
	if (product && product.price) {
		if (cart.hasItem(product.id)) {
			cart.removeItem(product.id)
		} else {
			cart.addItem(product)
		}
	}
	modal.close()
})

events.on('cart:change', () => {
	header.render({ count: cart.getItemCount() })

	const selected = productCatalog.getSelectedProduct()
	if (selected) {
		events.emit('product:selected', {})
	}
})

events.on('basket:open', () => {
	const items = cart.getItems()
	const basketContainer = basketTemplate.content.cloneNode(true) as HTMLElement
	const basketElement = basketContainer.querySelector('.basket') as HTMLElement

	if (!basket) {
		basket = new Basket(basketElement, events)
	}

	const itemElements = items.map((item, index) => {
		const itemTemplate = cartItemTemplate.content.cloneNode(true) as HTMLElement
		const itemElement = itemTemplate.querySelector(
			'.basket__item',
		) as HTMLElement
		const itemView = new CartItem(itemElement, {
			onDelete: () => {
				events.emit('basket:remove', { id: item.id })
			},
		})

		itemView.render({
			title: item.title,
			price: item.price,
			index: index + 1,
		})

		return itemElement
	})

	const itemsContainer = document.createElement('ul')
	itemsContainer.className = 'basket__list'
	itemElements.forEach(el => itemsContainer.appendChild(el))

	basket.render({
		items: itemsContainer,
		total: cart.getTotalPrice(),
	})

	modal.modalContent = basketElement
	modal.open()
})

events.on('basket:remove', (data: { id: string }) => {
	cart.removeItem(data.id)
})

events.on('basket:checkout', () => {
	modal.close()
	currentStep = 1
	const orderContainer = orderTemplate.content.cloneNode(true) as HTMLElement
	const orderElement = orderContainer.querySelector('form') as HTMLElement

	if (!orderForm) {
		orderForm = new OrderForm(orderElement, events)
	}

	const buyerData = buyer.getBuyer()
	orderForm.render()
	orderForm.address = buyerData.address

	const errors = buyer.validate()
	orderForm.setErrors(errors)

	modal.modalContent = orderElement
	modal.open()
})

events.on('order:address', (data: { address: string }) => {
	buyer.saveBuyerData({ address: data.address })
})

events.on('order:payment', (data: { payment: string }) => {
	buyer.saveBuyerData({ payment: data.payment as any })
})

events.on('buyer:change', () => {
	const errors = buyer.validate()
	if (currentStep === 1 && orderForm) {
		orderForm.setErrors(errors)
	}
})

events.on('order:submit', () => {
	currentStep = 2
	const contactsContainer = contactsTemplate.content.cloneNode(
		true,
	) as HTMLElement
	const contactsElement = contactsContainer.querySelector('form') as HTMLElement

	if (!contactsForm) {
		contactsForm = new ContactsForm(contactsElement, events)
	}

	const buyerData = buyer.getBuyer()
	contactsForm.render()
	contactsForm.email = buyerData.email
	contactsForm.phone = buyerData.phone

	const errors = buyer.validate()
	contactsForm.setErrors(errors)

	modal.modalContent = contactsElement
})

events.on('contacts:email', (data: { email: string }) => {
	buyer.saveBuyerData({ email: data.email })
})

events.on('contacts:phone', (data: { phone: string }) => {
	buyer.saveBuyerData({ phone: data.phone })
})

events.on('contacts:submit', () => {
	const buyerData = buyer.getBuyer()
	const items = cart.getItems()
	const order = {
		payment: buyerData.payment,
		email: buyerData.email,
		phone: buyerData.phone,
		address: buyerData.address,
		items: items.map(item => item.id),
		total: cart.getTotalPrice(),
	}

	apiService
		.submitOrder(order)
		.then(() => {
			const successContainer = successTemplate.content.cloneNode(
				true,
			) as HTMLElement
			const successElement = successContainer.querySelector(
				'.order-success',
			) as HTMLElement

			if (!successView) {
				successView = new SuccessView(successElement, events)
			}

			successView.render({ total: cart.getTotalPrice() })
			modal.modalContent = successElement
			cart.clear()
			buyer.clear()
		})
		.catch(err => console.error('ошибка при отправке заказа:', err))
})

events.on('success:close', () => {
	modal.close()
})

apiService
	.getProducts()
	.then(data => {
		productCatalog.setProducts(data.items)
	})
	.catch(err => console.error('ошибка при загрузке товаров:', err))
