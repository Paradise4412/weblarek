import { Api } from './components/base/Api'
import { EventEmitter } from './components/base/Events'
import { ApiService } from './components/Models/ApiService'
import { BuyerData } from './components/Models/BuyerData'
import { Cart } from './components/Models/Cart'
import { ProductCatalog } from './components/Models/ProductCatalog'
import { Basket } from './components/View/Basket'
import { CardCatalog } from './components/View/CardCatalog'
import { CardPreview } from './components/View/CardPreview'
import { ContactsForm } from './components/View/ContactsForm'
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

const cardCatalogTemplate = document.querySelector(
	'#card-catalog',
) as HTMLTemplateElement
const cardPreviewTemplate = document.querySelector(
	'#card-preview',
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

events.on('catalog:change', () => {
	const products = productCatalog.getProducts()
	galleryElement.innerHTML = ''
	products.forEach(product => {
		const cardTemplate = cardCatalogTemplate.content.cloneNode(
			true,
		) as HTMLElement
		const cardElement = cardTemplate.querySelector('.card') as HTMLElement
		const cardView = new CardCatalog(cardElement, events)
		cardElement.dataset.id = product.id
		cardView.render(product)
		galleryElement.appendChild(cardElement)
	})
})

events.on('card:select', (data: any) => {
	const product = productCatalog.getProductById(data.id)
	if (product) {
		productCatalog.setSelectedProduct(product)
		const previewTemplate = cardPreviewTemplate.content.cloneNode(
			true,
		) as HTMLElement
		const cardElement = previewTemplate.querySelector('.card') as HTMLElement
		const cardPreview = new CardPreview(cardElement, events)

		const inCart = cart.hasItem(product.id)
		cardPreview.setButtonState(inCart, !product.price)
		cardPreview.render(product)

		modal.modalContent = cardElement
		modal.open()
	}
})

events.on('product:selected', (data: any) => {
	const product = data.product
	if (product) {
		const modalContent = modal.modalContent
		if (modalContent && modalContent.querySelector('.card_full')) {
			const inCart = cart.hasItem(product.id)
			const cardElement = modalContent.querySelector('.card') as HTMLElement
			const cardPreview = new CardPreview(cardElement, events)
			cardPreview.setButtonState(inCart, !product.price)
		}
	}
})

events.on('card:buy', (data: any) => {
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
		events.emit('product:selected', { product: selected })
	}

	const modalContent = modal.modalContent
	if (modalContent && modalContent.querySelector('.basket')) {
		const items = cart.getItems()
		const basketContainer = basketTemplate.content.cloneNode(
			true,
		) as HTMLElement
		const basket = new Basket(basketContainer.querySelector('.basket')!, events)
		modal.modalContent = basketContainer.querySelector('.basket')!
		basket.render(items)
	}
})

events.on('basket:open', () => {
	const items = cart.getItems()
	const basketContainer = basketTemplate.content.cloneNode(true) as HTMLElement
	const basket = new Basket(basketContainer.querySelector('.basket')!, events)
	modal.modalContent = basketContainer.querySelector('.basket')!
	basket.render(items)
	modal.open()
})

events.on('basket:remove', (data: any) => {
	cart.removeItem(data.id)
})

events.on('basket:checkout', () => {
	modal.close()
	currentStep = 1
	const orderContainer = orderTemplate.content.cloneNode(true) as HTMLElement
	const orderForm = new OrderForm(orderContainer.querySelector('form')!, events)
	modal.modalContent = orderContainer.querySelector('form')!
	const buyerData = buyer.getBuyer()
	orderForm.render(buyerData)
	const errors = buyer.validate()
	orderForm.setErrors(errors)
	modal.open()
})

events.on('order:address', (data: any) => {
	buyer.saveBuyerData({ address: data.address })
})

events.on('order:payment', (data: any) => {
	buyer.saveBuyerData({ payment: data.payment })
})

events.on('buyer:change', () => {
	const errors = buyer.validate()
	if (currentStep === 1) {
		const form = modal.modalContent.querySelector('form') as HTMLFormElement
		if (form && form.name === 'order') {
			const orderForm = new OrderForm(form, events)
			orderForm.setErrors(errors)
		}
	}
})

events.on('order:submit', () => {
	currentStep = 2
	const contactsContainer = contactsTemplate.content.cloneNode(
		true,
	) as HTMLElement
	const contactsForm = new ContactsForm(
		contactsContainer.querySelector('form')!,
		events,
	)
	modal.modalContent = contactsContainer.querySelector('form')!
	const buyerData = buyer.getBuyer()
	contactsForm.render(buyerData)
	const errors = buyer.validate()
	contactsForm.setErrors(errors)
})

events.on('contacts:email', (data: any) => {
	buyer.saveBuyerData({ email: data.email })
})

events.on('contacts:phone', (data: any) => {
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
		.submitOrder(order as any)
		.then(() => {
			const successContainer = successTemplate.content.cloneNode(
				true,
			) as HTMLElement
			const successView = new SuccessView(
				successContainer.querySelector('.order-success')!,
				events,
			)
			modal.modalContent = successContainer.querySelector('.order-success')!
			successView.render({ total: cart.getTotalPrice() })
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
