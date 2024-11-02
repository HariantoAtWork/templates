import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const filePath = resolve('data/clientstorage.json')
    const data = readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  }

  if (method === 'DELETE') {
    const domain = event.context.params.domain
    const filePath = resolve('data/clientstorage.json')
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))

    if (data[domain]) {
      console.log({ data, domain })
      delete data[domain]
      writeFileSync(filePath, JSON.stringify(data, null, 4))
      return { success: true, message: `Domain ${domain} deleted successfully` }
    }

    return { success: false, message: 'Domain not found' }
  }

  return { success: false, message: 'Method not supported' }
})
