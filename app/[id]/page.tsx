import Back from '@/app/[id]/Back'
import Slider from '@/app/[id]/Slider'
import { getTaxiById } from '@/data/TaxiApi'
import { notFound } from 'next/navigation'

async function Page(props: { params: { id?: string } }) {
	if (!props.params.id) {
		return notFound()
	}

	const taxiData = await getTaxiById(Number(props.params.id))

	return (
		<>
			<h1>
				{taxiData.item.brand} {taxiData.item.model}
			</h1>
			<nav>
				<Back />
			</nav>
			<main>
				<p>Цена: {taxiData.item.price}</p>
				<p>
					Тариф:{' '}
					{Object.entries(taxiData.item.tarif)
						.map((x) => x[1])
						.join(', ')}
				</p>
				{taxiData.item.images ? <Slider images={taxiData.item.images} /> : null}
			</main>
		</>
	)
}

export default Page
