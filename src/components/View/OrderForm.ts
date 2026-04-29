import { IEvents } from '../base/Events'
import { Form } from './Form'
import { TPayment } from '../../types/index'

export class OrderForm extends Form {
	protected addressInput: HTMLInputElement
	protected paymentButtons: HTMLButtonElement[]

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events)

		this.addressInput = this.form.querySelector('input[name="address"]')!
		this.paymentButtons = Array.from(
			this.form.querySelectorAll('.order__buttons button'),
		)

		this.addressInput.addEventListener('input', e => {
			this.events.emit('order:address', {
				address: (e.target as HTMLInputElement).value,
			})
		})

		this.paymentButtons.forEach(btn => {
			btn.addEventListener('click', () => {
				const payment = btn.getAttribute('name')
				if (payment === 'card' || payment === 'cash') {
					this.events.emit('order:payment', { payment })
				}
			})
		})

		this.form.addEventListener('submit', e => {
			e.preventDefault()
			this.events.emit('order:submit')
		})
	}

	set address(value: string) {
		this.addressInput.value = value
	}

	set payment(value: TPayment | null) {
		this.paymentButtons.forEach(btn => {
			btn.classList.remove('button_alt-active')
			if (value && btn.getAttribute('name') === value) {
				btn.classList.add('button_alt-active')
			}
		})
	}
}
