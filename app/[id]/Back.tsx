'use client'

import { useRouter } from 'next/navigation'

function Back() {
	const router = useRouter()

	return (
		<button type="button" onClick={() => router.back()}>
			Назад
		</button>
	)
}

export default Back
