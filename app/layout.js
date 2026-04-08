import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Nim student Course Page',
    description: 'Course enrollment page',
    icons: {
        icon: '/Nim Academy.png', // Assuming it's in public folder
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}




