import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  const domain = event.context.params.domain
  const filePath = resolve('data/clientstorage.json')
  const data = JSON.parse(readFileSync(filePath, 'utf-8'))

  if (data[domain]) {
    delete data[domain]
    writeFileSync(filePath, JSON.stringify(data, null, 4))
    return { success: true, message: `Domain ${domain} deleted successfully` }
  }

  return { success: false, message: 'Domain not found' }
})
