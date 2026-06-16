// Global 404 boundary. Because the app uses multiple root layouts via route
// groups ((site) and (payload)), this file renders its own <html>/<body>.
export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
          fontFamily: 'Inter, system-ui, sans-serif',
          background: '#000',
          color: '#fff',
        }}
      >
        <h1 style={{ fontSize: '3rem', margin: 0 }}>404</h1>
        <p style={{ opacity: 0.7 }}>This page could not be found.</p>
      </body>
    </html>
  )
}
