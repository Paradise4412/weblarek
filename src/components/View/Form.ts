import { IBuyer, TBuyerErrors } from '../../types/index'
import { Component } from '../base/Component'
import { IEvents } from '../base/Events'

export class Form extends Component<Partial<IBuyer>> {
	protected form: HTMLFormElement
	protected submitBtn: HTMLButtonElement
	protected errorContainer: HTMLElement

	constructor(
		container: HTMLElement,
		protected events: IEvents,
	) {
		super(container)

		this.form =
			container instanceof HTMLFormElement
				? container
				: container.querySelector('form')!
		this.submitBtn = this.form.querySelector('[type="submit"]')!
		this.errorContainer = this.form.querySelector('.form__errors')!
	}

	protected toggleSubmitButton(isValid: boolean): void {
		this.submitBtn.disabled = !isValid
	}

	setErrors(errors: TBuyerErrors): void {
		if (Object.keys(errors).length === 0) {
			this.errorContainer.textContent = ''
			this.toggleSubmitButton(true)
		} else {
			this.errorContainer.textContent = Object.values(errors).join(', ')
			this.toggleSubmitButton(false)
		}
	}

	render(): HTMLElement {
		return this.container
	}
}
