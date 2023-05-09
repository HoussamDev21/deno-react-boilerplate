import { renderToReadableStream } from "react-dom/server"
import { serve } from 'std/http/server.ts'
import build from "./lib/build.ts"
import App from "./app/App.tsx"

// deno imports used in client side as well
build([
  "react",
  "react/jsx-runtime",
  "react-dom/client"
])

async function handler(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url)

  // handle GET favicon
  if (pathname === '/favicon.ico') {
    const favicon = await Deno.readFile('./icon.png')
    return new Response(new Blob([favicon.buffer]))
  }

  // the main document
  const doc = <html>
    <body>
      <main id="root">
        <App />
      </main>
    </body>
  </html>

  // inject js bundle in client side previously generated by build(...) function
  const scriptContent = await Deno.readTextFile('./app/build/index.js')
  const stream = await renderToReadableStream(doc, {
    bootstrapScriptContent: scriptContent,
  })

  const response = new Response(stream, {
    headers: { "content-type": "text/html" },
  })

  return response
}

serve(handler, { port: 8000 })