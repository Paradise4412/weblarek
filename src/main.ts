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
import { TPayment } from './types/index'

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
header.render({ count: 0 })

const galleryElement = document.querySelector('.gallery') as HTMLElement
const gallery = new Gallery(galleryElement)

const cardCatalogTemplate = document.querySelector(
	'#card-catalog',
) as HTMLTemplateElement
const cardPreviewTemplate = document.querySelector(
	'#card-preview',
) as HTMLTemplateElement
const cartItemTemplate = document.querySelector(
	'#card-basket',
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

const cardPreviewElement = cardPreviewTemplate.content.cloneNode(
	true,
) as DocumentFragment
const cardPreviewContainer = (cardPreviewElement as any).querySelector(
	'.card',
) as HTMLElement
const cardPreview = new CardPreview(cardPreviewContainer, {
	onClick: () => {
		const product = productCatalog.getSelectedProduct()
		if (product) {
			events.emit('card:buy', { id: product.id })
		}
	},
})

const basketElement = basketTemplate.content.cloneNode(true) as DocumentFragment
const basketContainer = basketElement.firstElementChild as HTMLElement
const basket = new Basket(basketContainer, events)

const orderElement = orderTemplate.content.cloneNode(true) as DocumentFragment
const orderContainer = orderElement.firstElementChild as HTMLElement
const orderForm = new OrderForm(orderContainer, events)

const contactsElement = contactsTemplate.content.cloneNode(
	true,
) as DocumentFragment
const contactsContainer = contactsElement.firstElementChild as HTMLElement
const contactsForm = new ContactsForm(contactsContainer, events)

const successElement = successTemplate.content.cloneNode(
	true,
) as DocumentFragment
const successContainer = successElement.firstElementChild as HTMLElement
const successView = new SuccessView(successContainer, events)

events.on('catalog:change', () => {
	const products = productCatalog.getProducts()
	const cardElements = products.map(product => {
		const cardTemplate = cardCatalogTemplate.content.cloneNode(
			true,
		) as DocumentFragment
		const cardElement = (cardTemplate as any).querySelector(
			'.card',
		) as HTMLElement
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
		cardPreview.render({
			title: product.title,
			image: product.image,
			category: product.category,
			price: product.price,
			description: product.description,
		})

		const inCart = cart.hasItem(product.id)
		cardPreview.setButtonState(inCart, !product.price)

		modal.modalContent = cardPreviewContainer
		modal.open()
	}
})

events.on('card:buy', (data: { id: string }) => {
	const product = productCatalog.getProductById(data.id)
	if (product?.price) {
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
})

function updateBasketView(): void {
	const items = cart.getItems()

	if (items.length === 0) {
		basket.items = []
		basket.toggleCheckoutButton(false)
	} else {
		const itemElements = items.map((item, index) => {
			const itemTemplate = cartItemTemplate.content.cloneNode(
				true,
			) as DocumentFragment
			const itemElement = (itemTemplate as any).querySelector(
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

		basket.items = itemElements
		basket.toggleCheckoutButton(true)
	}

	basket.total = cart.getTotalPrice()
}

events.on('basket:open', () => {
	updateBasketView()
	modal.modalContent = basket.render()
	modal.open()
})

events.on('basket:remove', (data: { id: string }) => {
	cart.removeItem(data.id)
})

events.on('basket:checkout', () => {
	currentStep = 1

	const buyerData = buyer.getBuyer()
	orderForm.address = buyerData.address
	orderForm.payment = buyerData.payment

	const errors = buyer.validate()
	const { payment, address } = errors
	orderForm.setErrorText(
		[payment, address].filter(Boolean).join('; '),
	)
	orderForm.setSubmitEnabled(!payment && !address)

	modal.modalContent = orderContainer
	modal.open()
})

events.on('order:address', (data: { address: string }) => {
	buyer.saveBuyerData({ address: data.address })
})

events.on('order:payment', (data: { payment: TPayment }) => {
	buyer.saveBuyerData({ payment: data.payment })
})

events.on('buyer:change', () => {
	const buyerData = buyer.getBuyer()
	const errors = buyer.validate()

	const { payment, address, email, phone } = errors

	orderForm.payment = buyerData.payment
	orderForm.address = buyerData.address
	orderForm.setErrorText(
		[payment, address].filter(Boolean).join('; '),
	)
	orderForm.setSubmitEnabled(!payment && !address)

	contactsForm.email = buyerData.email
	contactsForm.phone = buyerData.phone
	contactsForm.setErrorText(
		[email, phone].filter(Boolean).join('; '),
	)
	contactsForm.setSubmitEnabled(!email && !phone)
})

events.on('order:submit', () => {
	currentStep = 2

	const buyerData = buyer.getBuyer()
	contactsForm.email = buyerData.email
	contactsForm.phone = buyerData.phone

	const errors = buyer.validate()
	const { email, phone } = errors
	contactsForm.setErrorText(
		[email, phone].filter(Boolean).join('; '),
	)
	contactsForm.setSubmitEnabled(!email && !phone)

	modal.modalContent = contactsContainer
	modal.open()
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
			successView.total = cart.getTotalPrice()
			modal.modalContent = successContainer
			modal.open()
			cart.clear()
			buyer.clear()
		})
		.catch(err => console.error('ошибка при отправке заказа:', err))
})

events.on('success:close', () => {
	modal.close()
})

try {
	const data = await apiService.getProducts()
	productCatalog.setProducts(data.items)
} catch (err) {
	console.error('ошибка при загрузке товаров:', err)
}
