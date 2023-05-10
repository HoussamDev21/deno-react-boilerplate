import App from "./App.tsx"

export default function Root() {
  return <html>
    <head>
      <link rel="icon" type="image/png" href="/public/icon.png" />
    </head>
    <body>
      <main id="root">
        <App />
      </main>
    </body>
  </html>
}