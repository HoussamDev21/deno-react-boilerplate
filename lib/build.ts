import * as esbuild from 'esbuild'
import importMap from '@/import-map.json' assert { type: 'json' }

export default async function build(pkgs: string[]) {

  // this Plugin resolve deno imports in client side (like react), since we don't use npm
  const resolveFromDeno = (pkgName: string): esbuild.Plugin => ({
    name: pkgName,
    setup: (build) => {
      build.onResolve({ filter: new RegExp(`^${pkgName}$`) }, (args) => ({
        path: args.path,
        namespace: `${pkgName}-ns`,
      }))
      build.onLoad({ filter: /.*/, namespace: `${pkgName}-ns` }, async () => {
        // @ts-ignore: TODO: get union type from importMap.imports keys
        const res = await fetch(importMap.imports[pkgName])
        const code = await res.text()
        return {
          contents: code,
        }
      })
    }
  })
  
  // this Plugin resolve imports that not exists in filesystem
  // since we don't have a node_modules folder we need to fetch modules needed in client side
  const httpPlugin: esbuild.Plugin = {
    name: 'http',
    setup: (build) => {
      build.onResolve({ filter: /^\// }, (args) => {
        const { origin } = new URL(args.importer)
        return {
          path: origin + args.path,
          namespace: 'http-ns'
        }
      })
      // handle absolute imports
      build.onResolve({ filter: /^https?:\/\// }, (args) => ({
        path: args.path,
        namespace: 'http-ns'
      }))
      build.onLoad({ filter: /.*/, namespace: 'http-ns' }, async (args) => {
        const res = await fetch(args.path)
        const code = await res.text()
        return {
          contents: code,
        }
      })
    }
  }

  await esbuild.build({
    // app/index.tsx is where we hydrate DOM previously generated in server side
    entryPoints: ['app/index.tsx'],
    bundle: true,
    outdir: 'app/build',
    jsx: 'automatic',
    minify: true,
    treeShaking: true,
    plugins: [
      ...pkgs.map(pkg => resolveFromDeno(pkg)),
      httpPlugin
    ]
  })
  
  esbuild.stop()
}