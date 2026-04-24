import { IProduct } from '../../types/index'
import { Component } from '../base/Component'

export class Gallery extends Component<IProduct[]> {
	constructor(container: HTMLElement) {
		super(container)
	}

	render(): HTMLElement {
		this.container.innerHTML = ''
		return this.container
	}
}
