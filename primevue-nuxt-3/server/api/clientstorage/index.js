import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export default defineEventHandler(async (event) => {
  const filePath = resolve('data/clientstorage.json')
  const data = readFileSync(filePath, 'utf-8')
  return JSON.parse(data)
})
