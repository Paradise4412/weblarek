import { IBuyer } from '../../types/index'
import { IEvents } from '../base/Events'
import { Form } from './Form'

export class ContactsForm extends Form {
	protected emailInput: HTMLInputElement
	protected phoneInput: HTMLInputElement

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events)

		this.emailInput = this.form.querySelector('input[name="email"]')!
		this.phoneInput = this.form.querySelector('input[name="phone"]')!

		this.emailInput.addEventListener('input', e => {
			this.events.emit('contacts:email', {
				email: (e.target as HTMLInputElement).value,
			})
		})

		this.phoneInput.addEventListener('input', e => {
			this.events.emit('contacts:phone', {
				phone: (e.target as HTMLInputElement).value,
			})
		})

		this.form.addEventListener('submit', e => {
			e.preventDefault()
			this.events.emit('contacts:submit')
		})
	}

	render(data?: Partial<IBuyer>): HTMLElement {
		if (data?.email) {
			this.emailInput.value = data.email
		}
		if (data?.phone) {
			this.phoneInput.value = data.phone
		}
		return this.container
	}
}
