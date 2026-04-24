import { IBuyer, TBuyerErrors } from '../../types/index'
import { IEvents } from '../base/Events'

export class BuyerData {
	protected data: IBuyer

	constructor(protected events: IEvents) {
		this.data = {
			payment: null,
			email: '',
			phone: '',
			address: '',
		}
	}

	saveBuyerData(values: Partial<IBuyer>): void {
		Object.assign(this.data, values)
		this.events.emit('buyer:change')
	}

	getBuyer(): IBuyer {
		return this.data
	}

	clear(): void {
		this.data = {
			payment: null,
			email: '',
			phone: '',
			address: '',
		}
		this.events.emit('buyer:change')
	}

	validate(): TBuyerErrors {
		const errors: TBuyerErrors = {}

		if (!this.data.payment) {
			errors.payment = 'не выбран вид оплаты'
		}

		if (!this.data.email || this.data.email.trim() === '') {
			errors.email = 'укажите почту'
		}

		if (!this.data.phone || this.data.phone.trim() === '') {
			errors.phone = 'укажите телефон'
		}

		if (!this.data.address || this.data.address.trim() === '') {
			errors.address = 'укажите адрес'
		}

		return errors
	}
}
