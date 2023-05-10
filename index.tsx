import { serve } from 'std/http/server.ts'
import build from "@/lib/build.ts"
import requestHandler from "@/lib/request-handler.tsx"

// deno imports used in client side as well
build([
  "react",
  "react/jsx-runtime",
  "react-dom/client"
])

serve(requestHandler, { port: 8000 })
