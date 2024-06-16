'use client'

import type { getTaxiById } from '@/data/TaxiApi'
import Image from 'next/image'
import { useState } from 'react'
import styles from './page.module.css'

function Slider(props: {
	images: Awaited<ReturnType<typeof getTaxiById>>['item']['images']
}) {
	const [currentImage, setCurrentImage] = useState(0)

	function nextImage() {
		setCurrentImage((x) => (x + 1) % Object.keys(props.images).length)
	}

	function prevImage() {
		setCurrentImage(
			(x) =>
				(x - 1 + Object.keys(props.images).length) %
				Object.keys(props.images).length,
		)
	}

	return (
		<div className={styles.container}>
			<button type="button" onClick={prevImage}>
				Назад
			</button>
			<Image
				src={props.images[currentImage].image}
				alt=""
				width={690}
				height={656}
			/>
			<button type="button" onClick={nextImage}>
				Вперед
			</button>
		</div>
	)
}

export default Slider
