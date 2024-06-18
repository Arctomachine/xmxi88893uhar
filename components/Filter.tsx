'use client'

import type { FilterReturn } from '@/data/TaxiApi'
import { useRouter, useSearchParams } from 'next/navigation'
import {
	type ChangeEvent,
	type FormEvent,
	Fragment,
	useId,
	useState,
} from 'react'

function Filter(props: {
	filters: FilterReturn
}) {
	const router = useRouter()
	const searchParams = useSearchParams()

	const brandsFromUrl = searchParams.get(props.filters.brands.code)
	const modelsFromUrl = searchParams.get(props.filters.models.type)
	const tarifsFromUrl = searchParams.get(props.filters.tarif.type)

	const brandsId = useId()
	const modelsId = useId()
	const tarifId = useId()

	const allBrands = Object.values(props.filters.brands.values)
	const [selectedBrands, setSelectedBrands] = useState<string[]>(
		brandsFromUrl ? brandsFromUrl.split(',') : [],
	)
	const filteredBrands = selectedBrands.length > 0 ? selectedBrands : allBrands

	const allModels = Object.values(props.filters.models.values)
	const filteredModels = allModels.filter((car) =>
		filteredBrands.includes(car.brand),
	)
	const [selectedModels, setSelectedModels] = useState<string[]>(
		modelsFromUrl ? modelsFromUrl.split(',') : [],
	)

	const allTarifs = Object.entries(props.filters.tarif.values).map(
		([key, value]) => ({
			label: value,
			value: key,
		}),
	)
	const [selectedTarifs, setSelectedTarifs] = useState<string[]>(
		tarifsFromUrl ? tarifsFromUrl.split(',') : [],
	)

	function onBrandChange(e: ChangeEvent<HTMLSelectElement>) {
		const options = e.target.options
		const value = []
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				value.push(options[i].value)
			}
		}
		setSelectedBrands(value)
	}

	function onModelChange(e: ChangeEvent<HTMLSelectElement>) {
		const options = e.target.options
		const value = []
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				value.push(options[i].value)
			}
		}
		setSelectedModels(value)
	}

	function onTarifChange(e: ChangeEvent<HTMLSelectElement>) {
		const options = e.target.options
		const value = []
		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				value.push(options[i].value)
			}
		}
		setSelectedTarifs(value)
	}

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		const params = new URLSearchParams()
		params.set(props.filters.brands.code, selectedBrands.join(','))
		params.set(props.filters.models.type, selectedModels.join(','))
		params.set(props.filters.tarif.type, selectedTarifs.join(','))
		params.set('page', '1')

		router.push(`/?${params.toString()}`)
	}

	function onReset(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		setSelectedBrands([])
		setSelectedModels([])
		setSelectedTarifs([])

		router.push('/')
	}

	return (
		<form onSubmit={onSubmit} onReset={onReset}>
			<div>
				<label htmlFor={brandsId}>Марки</label>
				<br />
				<select
					id={brandsId}
					name={props.filters.brands.code}
					multiple={true}
					value={selectedBrands}
					onChange={onBrandChange}
				>
					{allBrands.map((brand) => (
						<option key={brand} value={brand}>
							{brand}
						</option>
					))}
				</select>
			</div>
			<div>
				<label htmlFor={modelsId}>Модели</label>
				<br />
				<select
					id={modelsId}
					name={props.filters.models.type}
					multiple={true}
					value={selectedModels}
					onChange={onModelChange}
				>
					{filteredModels.map((car) => {
						const models = Object.values(car.models)
						return (
							<Fragment key={car.brand}>
								{models.map((model) => (
									<option key={model} value={model}>
										{model}
									</option>
								))}
							</Fragment>
						)
					})}
				</select>
			</div>
			<div>
				<label htmlFor={tarifId}>Тариф</label>
				<br />
				<select
					id={tarifId}
					name={props.filters.tarif.type}
					multiple={true}
					value={selectedTarifs}
					onChange={onTarifChange}
				>
					{allTarifs.map((tarif) => (
						<option key={tarif.value} value={tarif.value}>
							{tarif.label}
						</option>
					))}
				</select>
			</div>
			<div>
				<button type="reset">Сбросить</button>
				<button type="submit">Искать</button>
			</div>
		</form>
	)
}

export default Filter
