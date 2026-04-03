import {
	IApi,
	IApiProductsResponse,
	IOrderData,
	IOrderResponse,
} from '../../types/index'

export class ApiService {
	protected api: IApi

	constructor(api: IApi) {
		this.api = api
	}

	getProducts(): Promise<IApiProductsResponse> {
		return this.api.get<IApiProductsResponse>('/product/')
	}

	submitOrder(data: IOrderData): Promise<IOrderResponse> {
		return this.api.post<IOrderResponse>('/order/', data, 'PUT')
	}
}
