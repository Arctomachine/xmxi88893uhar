import './globals.css'
import type { ReactNode } from 'react'

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode
}>) {
	return (
		<html lang="ru">
			<body>{children}</body>
		</html>
	)
}
