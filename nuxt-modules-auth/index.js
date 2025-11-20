// `nuxt/kit` is a helper subpath import you can use when defining local modules
// that means you do not need to add `@nuxt/kit` to your project's dependencies
import { promises as fsp } from 'node:fs'
import { relative, join, normalize } from 'pathe'
import { extendPages, addComponentsDir, defineNuxtModule, createResolver, addServerHandler } from '@nuxt/kit'
import checkEnvironmentVariables from './lib/checkEnvironmentVariables.server'

// Check environment variables
// This is done here to ensure that the environment variables are checked before any other code is executed
checkEnvironmentVariables()

export default defineNuxtModule({
  meta: {
    name: 'module-auth',
  },
  setup() {
    const resolver = createResolver(import.meta.url)
    const pagesRoot = resolver.resolve('./pages')

    // Add an API route
    addServerHandler({
      route: '/api/auth/**',
      handler: resolver.resolve('./runtime/auth'),
    })

    addComponentsDir({
      path: resolver.resolve('./components'),
    })

    extendPages(async (pages) => {
      if (!(await directoryExists(pagesRoot))) {
        return
      }

      const vueFiles = await collectVueFiles(pagesRoot)
      if (!vueFiles.length) {
        return
      }

      const knownPaths = new Set(pages.map((page) => normalize(page.path)))

      for (const file of vueFiles) {
        const route = createRouteFromFile(file, pagesRoot)
        if (!route) {
          continue
        }

        if (knownPaths.has(route.path)) {
          continue
        }

        pages.push(route)
        knownPaths.add(route.path)
      }
    })
  },
})

const directoryExists = async (directory) => {
  try {
    const stats = await fsp.stat(directory)
    return stats.isDirectory()
  } catch {
    return false
  }
}

const collectVueFiles = async (directory) => {
  const entries = await fsp.readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = join(directory, entry.name)

    if (entry.isDirectory()) {
      const nestedFiles = await collectVueFiles(entryPath)
      files.push(...nestedFiles)
    } else if (entry.isFile() && entry.name.endsWith('.vue')) {
      files.push(entryPath)
    }
  }

  files.sort()
  return files
}

const createRouteFromFile = (file, pagesRoot) => {
  const relativePath = relative(pagesRoot, file).replace(/\.vue$/, '')
  if (relativePath.startsWith('..')) {
    return null
  }

  const segments = relativePath.split('/')
  const pathSegments = segments
    .map(segmentToPathPart)
    .filter((segment) => segment !== null && segment !== '')
  const routePath = `/${pathSegments.join('/')}`
  const routeName = createRouteName(segments)

  return {
    name: routeName,
    path: routePath,
    file,
  }
}

const segmentToPathPart = (segment) => {
  if (segment === 'index') {
    return ''
  }

  if (!segment.includes('[')) {
    return segment
  }

  const isOptional = segment.startsWith('[[') && segment.endsWith(']]')
  const inner = stripBrackets(segment)
  const isCatchAll = inner.startsWith('...')
  const parameterName = (isCatchAll ? inner.slice(3) : inner) || 'slug'

  let path = `:${parameterName}`

  if (isCatchAll) {
    path += '(.*)*'
  } else if (isOptional) {
    path += '?'
  }

  return path
}

const createRouteName = (segments) => {
  const parts = segments
    .filter((segment) => !(segment === 'index' && segments.length > 1))
    .map((segment) => stripBrackets(segment).replace(/^\.\.\./, ''))
    .map((segment) => segment.replace(/\./g, '-'))
    .filter(Boolean)

  const name = parts.join('-')
  return name || 'index'
}

const stripBrackets = (value) => {
  let result = value

  while (result.startsWith('[') && result.endsWith(']')) {
    result = result.slice(1, -1)
  }

  return result
}
