import { Component } from '../base/Component'

export type TGallery = {
	items?: HTMLElement[]
}

export class Gallery extends Component<TGallery> {
	constructor(container: HTMLElement) {
		super(container)
	}

	set items(items: HTMLElement[]) {
		this.container.innerHTML = ''
		items.forEach(item => {
			this.container.appendChild(item)
		})
	}
}
