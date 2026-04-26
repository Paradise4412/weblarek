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

let cardPreview: CardPreview | null = null
let basket: Basket | null = null
let orderForm: OrderForm | null = null
let contactsForm: ContactsForm | null = null
let successView: SuccessView | null = null

let cardPreviewContainer: HTMLElement | null = null
let basketContainer: HTMLElement | null = null
let orderContainer: HTMLElement | null = null
let contactsContainer: HTMLElement | null = null
let successContainer: HTMLElement | null = null

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
		if (!cardPreview || !cardPreviewContainer) {
			const cardPreviewElement = cardPreviewTemplate.content.cloneNode(
				true,
			) as DocumentFragment
			cardPreviewContainer = (cardPreviewElement as any).querySelector(
				'.card',
			) as HTMLElement
			if (cardPreviewContainer) {
				cardPreview = new CardPreview(cardPreviewContainer, {
					onClick: () => {
						const product = productCatalog.getSelectedProduct()
						if (product) {
							events.emit('card:buy', { id: product.id })
						}
					},
				})
			}
		}

		if (cardPreview && cardPreviewContainer) {
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
	if (selected && cardPreview) {
		const inCart = cart.hasItem(selected.id)
		cardPreview.setButtonState(inCart, !selected.price)
	}

	if (basketContainer && modal.modalContent === basketContainer) {
		updateBasketView()
	}
})

function updateBasketView(): void {
	if (!basket || !basketContainer) {
		const basketElement = basketTemplate.content.cloneNode(
			true,
		) as DocumentFragment
		basketContainer = basketElement.firstElementChild as HTMLElement
		if (basketContainer) {
			basket = new Basket(basketContainer, events)
		}
	}

	if (!basket || !basketContainer) {
		return
	}

	const items = cart.getItems()

	if (items.length === 0) {
		const emptyDiv = document.createElement('div')
		emptyDiv.innerHTML =
			'<p style="text-align: center; padding: 20px;">Корзина пуста</p>'
		basket.items = emptyDiv
		basket.toggleCheckoutButton(false)
	} else {
		const itemsContainer = document.createElement('ul')
		itemsContainer.className = 'basket__list'

		items.forEach((item, index) => {
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

			itemsContainer.appendChild(itemElement)
		})

		basket.items = itemsContainer
		basket.toggleCheckoutButton(true)
	}

	basket.total = cart.getTotalPrice()
}

events.on('basket:open', () => {
	updateBasketView()
	modal.modalContent = basketContainer!
	modal.open()
})

events.on('basket:remove', (data: { id: string }) => {
	cart.removeItem(data.id)
})

events.on('basket:checkout', () => {
	currentStep = 1

	if (!orderForm || !orderContainer) {
		const orderElement = orderTemplate.content.cloneNode(
			true,
		) as DocumentFragment
		orderContainer = orderElement.firstElementChild as HTMLElement
		if (orderContainer) {
			orderForm = new OrderForm(orderContainer, events)
		}
	}

	if (orderForm && orderContainer) {
		const buyerData = buyer.getBuyer()
		orderForm.address = buyerData.address
		if (buyerData.payment) {
			orderForm.payment = buyerData.payment
		}

		const errors = buyer.validate()
		orderForm.setErrors(errors)

		modal.modalContent = orderContainer
	}
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
	if (currentStep === 2 && contactsForm) {
		contactsForm.setErrors(errors)
	}
})

events.on('order:submit', () => {
	currentStep = 2

	if (!contactsForm || !contactsContainer) {
		const contactsElement = contactsTemplate.content.cloneNode(
			true,
		) as DocumentFragment
		contactsContainer = contactsElement.firstElementChild as HTMLElement
		if (contactsContainer) {
			contactsForm = new ContactsForm(contactsContainer, events)
		}
	}

	if (contactsForm && contactsContainer) {
		const buyerData = buyer.getBuyer()
		contactsForm.email = buyerData.email
		contactsForm.phone = buyerData.phone

		const errors = buyer.validate()
		contactsForm.setErrors(errors)

		modal.modalContent = contactsContainer
		modal.open()
	}
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
			if (!successView || !successContainer) {
				const successElement = successTemplate.content.cloneNode(
					true,
				) as DocumentFragment
				successContainer = successElement.firstElementChild as HTMLElement
				if (successContainer) {
					successView = new SuccessView(successContainer, events)
				}
			}

			if (successView && successContainer) {
				successView.total = cart.getTotalPrice()
				modal.modalContent = successContainer
				modal.open()
				cart.clear()
				buyer.clear()
			}
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
