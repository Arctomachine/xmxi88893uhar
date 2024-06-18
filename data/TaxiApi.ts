import type { taxiDataShape } from '@/constants'
import 'server-only'

type _ModelsByBrand = {
	[K in (typeof taxiDataShape.models.values)[number] as K['brand']]: K['models'][number]
}

type Brand = (typeof taxiDataShape.brands.values)[number]
type Model<Brand extends keyof _ModelsByBrand> = _ModelsByBrand[Brand]
type Tarif =
	(typeof taxiDataShape.tarif.values)[keyof typeof taxiDataShape.tarif.values]

const baseUrl = 'https://test.taxivoshod.ru/api/test/'

type GetTaxiListReturn = {
	result: number
	page: number
	pages: number
	per_page: number
	list: {
		id: number
		brand: Brand
		model: Model<Brand>
		number: string
		price: number
		image: string
		tarif: Tarif[]
	}[]
}

export async function getTaxiList({
	brand,
	model,
	tarif,
	page = 1,
}: {
	brand?: string
	model?: string
	tarif?: string
	page?: number
}): Promise<GetTaxiListReturn> {
	const url = new URL(baseUrl)
	url.searchParams.set('w', 'catalog-cars')

	if (brand) {
		const brands = brand.split(',')
		for (const brand of brands) {
			url.searchParams.append('brand[]', decodeURIComponent(brand))
		}
	}

	if (model) {
		const models = model.split(',')
		for (const model of models) {
			url.searchParams.append('model[]', decodeURIComponent(model))
		}
	}

	if (tarif) {
		const tarifs = tarif.split(',')
		for (const tarif of tarifs) {
			url.searchParams.append('tarif[]', decodeURIComponent(tarif))
		}
	}

	url.searchParams.set('page', String(page))

	const response = await fetch(url.toString(), {
		next: {
			revalidate: process.env.NODE_ENV === 'development' ? 1000 * 60 * 60 : 0,
		},
	})

	if (!response.ok) {
		throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`)
	}

	try {
		const text = await response.text()
		return (await JSON.parse(text)) as GetTaxiListReturn
	} catch (error) {
		throw new Error(`Ошибка при чтении ответа: ${error}`)
	}
}

type GetTaxiByIdReturn = {
	result: number
	item: {
		brand: Brand
		model: Model<Brand>
		id: number
		price: number
		tarif: {
			[key: number]: string
		}
		images: {
			[key: number]: {
				id: string
				image: string
			}
		}
	}
}

export async function getTaxiById(id: number): Promise<GetTaxiByIdReturn> {
	const url = new URL(baseUrl)
	url.searchParams.set('w', 'catalog-car')
	url.searchParams.set('id', String(id))

	const response = await fetch(url.toString(), {
		next: {
			revalidate: process.env.NODE_ENV === 'development' ? 1000 * 60 * 60 : 0,
		},
	})

	if (!response.ok) {
		throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`)
	}

	try {
		const text = await response.text()
		return (await JSON.parse(text)) as GetTaxiByIdReturn
	} catch (error) {
		throw new Error(`Ошибка при чтении ответа: ${error}`)
	}
}

export type FilterReturn = {
	result: number
	brands: {
		name: string
		code: string
		values: {
			[key: number]: string
		}
	}
	models: {
		name: string
		type: string
		values: {
			[key: number]: {
				brand: string
				models: {
					[key: number]: string
				}
			}
		}
	}
	tarif: {
		name: string
		type: string
		values: {
			[key: number]: string
		}
	}
}

export async function getFilter(): Promise<FilterReturn> {
	const url = 'https://test.taxivoshod.ru/api/test/?w=catalog-filter'
	const response = await fetch(url, {
		next: {
			revalidate: process.env.NODE_ENV === 'development' ? 1000 * 60 * 60 : 0,
		},
	})

	if (!response.ok) {
		throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`)
	}

	try {
		const text = await response.text()
		return (await JSON.parse(text)) as FilterReturn
	} catch (error) {
		throw new Error(`Ошибка при чтении ответа: ${error}`)
	}
}
