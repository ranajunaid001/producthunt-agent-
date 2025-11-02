export const metadata = {
  title: 'Product Hunt Agent',
  description: 'AI agent for Product Hunt analysis',
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
