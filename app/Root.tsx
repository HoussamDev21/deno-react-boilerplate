import App from "./App.tsx"

export default function Root({ children }: { children: React.ReactNode }) {
  return <html>
    <head>
      <link rel="icon" type="image/png" href="/public/icon.png" />
    </head>
    <body>
      <main id="root">
        <App>{children}</App>
      </main>
    </body>
  </html>
}