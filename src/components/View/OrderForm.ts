import { IBuyer } from '../../types/index'
import { IEvents } from '../base/Events'
import { Form } from './Form'

export class OrderForm extends Form {
	protected addressInput: HTMLInputElement
	protected paymentButtons: HTMLButtonElement[]
	protected selectedPayment: string | null = null

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
				this.paymentButtons.forEach(b =>
					b.classList.remove('button_alt-active'),
				)
				btn.classList.add('button_alt-active')
				this.selectedPayment = btn.getAttribute('name')
				this.events.emit('order:payment', { payment: this.selectedPayment })
			})
		})

		this.form.addEventListener('submit', e => {
			e.preventDefault()
			this.events.emit('order:submit')
		})
	}

	render(data?: Partial<IBuyer>): HTMLElement {
		if (data?.address) {
			this.addressInput.value = data.address
		}
		return this.container
	}
}
