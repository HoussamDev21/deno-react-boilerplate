import { renderToReadableStream } from "react-dom/server"
import Root from "@/app/Root.tsx"

export default async function requestHandler(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url)
  if (req.method === 'GET' && pathname.startsWith('/public')) {
    const file = await Deno.readFile('.' + pathname)
    return new Response(new Blob([file.buffer]))
  }

  // inject js bundle in client side previously generated by build(...) function
  const scriptContent = await Deno.readTextFile('./app/build/index.js')
  const stream = await renderToReadableStream(<Root />, {
    bootstrapScriptContent: scriptContent,
  })

  const response = new Response(stream, {
    headers: { "content-type": "text/html" },
  })

  return response
}