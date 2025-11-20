// import './env.server'
import betterAuthPromise from './betterAuth.config'
import { betterAuth } from 'better-auth'
import { config } from 'dotenv'
config()


const useProxy =
    process.env.BETTER_AUTH_PROXY_URL || process.env.BETTER_AUTH_URL

export const auth = useProxy ? betterAuth({}) : betterAuthPromise()
