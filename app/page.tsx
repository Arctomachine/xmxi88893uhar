import Filter from '@/components/Filter'
import { getFilter, getTaxiList } from '@/data/TaxiApi'
import Image from 'next/image'
import Link from 'next/link'
import styles from './page.module.css'

export default async function Home(props: {
	searchParams: {
		brand?: string
		model?: string
		tarif?: string
		page: string
	}
}) {
	const page = Number(props.searchParams.page) || 1
	const brand = props.searchParams.brand
	const model = props.searchParams.model
	const tarif = props.searchParams.tarif

	const [taxiList, filters] = await Promise.all([
		getTaxiList({
			brand,
			model,
			tarif,
			page,
		}),
		getFilter(),
	])

	const nextPageUrl = new URLSearchParams()
	if (page < taxiList.pages) {
		nextPageUrl.set('page', String(page + 1))
	}
	if (brand) {
		nextPageUrl.set('brand', brand)
	}
	if (model) {
		nextPageUrl.set('model', model)
	}
	if (tarif) {
		nextPageUrl.set('tarif', tarif)
	}

	const prevPageUrl = new URLSearchParams()
	if (page > 1) {
		prevPageUrl.set('page', String(page - 1))
	}
	if (brand) {
		prevPageUrl.set('brand', brand)
	}
	if (model) {
		prevPageUrl.set('model', model)
	}
	if (tarif) {
		prevPageUrl.set('tarif', tarif)
	}

	return (
		<>
			<h1>Список автомобилей</h1>
			<p>
				Страница {page}/{taxiList.pages}
			</p>
			<div className={styles.navigation}>
				{taxiList.page > 1 ? (
					<Link href={`?${prevPageUrl.toString()}`}>Назад</Link>
				) : (
					<>Назад</>
				)}
				{taxiList.page < taxiList.pages ? (
					<Link href={`?${nextPageUrl.toString()}`}>Вперед</Link>
				) : (
					<>Вперед</>
				)}
			</div>
			<main className={styles.main}>
				<Filter filters={filters} />
				<ul className={styles.list}>
					{taxiList.list.map((taxi) => (
						<li key={taxi.id}>
							<Link href={`/${taxi.id}`}>
								{taxi.image ? (
									<Image
										src={taxi.image}
										alt={taxi.brand}
										width={275}
										height={150}
									/>
								) : (
									<div
										style={{
											width: 275,
											height: 150,
											backgroundColor: '#ccc',
										}}
									/>
								)}{' '}
								<br />
								{taxi.brand} {taxi.model} <br />
								Номер:{taxi.number} <br />
								Цена:{taxi.price} <br />
								Тариф:{taxi.tarif.join(', ')}
							</Link>
						</li>
					))}
				</ul>
			</main>
		</>
	)
}
