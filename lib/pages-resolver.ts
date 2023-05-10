import * as path from 'std/path/mod.ts'

const BASE_PATH = "./app/pages/"

interface RouteData {
  filePath: string
  routePath: string
}

const routes: RouteData[] = []
const segments: string[] = []

function readDir() {
  const list = Array.from(Deno.readDirSync(BASE_PATH + segments.join('/')))
    .sort((a, b) => a.name > b.name ? 1 : -1)
    .sort((a, b) => Number(a.isFile) - Number(b.isFile))
  list.forEach((entry) => {
    if (entry.isDirectory) {
      segments.push(entry.name)
      readDir()
      segments.pop()
    }
    else if (entry.isFile) {
      const filePath = BASE_PATH + [...segments, entry.name].join('/')
      let routePath = [...segments, entry.name].join('/')
      const { base, dir, ext } = path.parse(routePath)
      routePath = path.normalize('/' + [dir, base.replace(ext, '')].filter(segment => segment !== 'index').join('/'))
      routes.push({ filePath, routePath })
    }
  })
}

export default function pagesResolver() {
  readDir()
  return routes
}