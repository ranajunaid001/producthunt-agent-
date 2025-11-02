import './globals.css';

export const metadata = {
  title: 'Product Hunt AI',
  description: 'Ask anything about today\'s Product Hunt',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
