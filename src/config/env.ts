import fs from 'node:fs'
import path from 'node:path'

import dotenv from 'dotenv'
import { z } from 'zod'

const rootDir = path.resolve(__dirname, '../..')
const lockedEnvKeys = new Set(Object.keys(process.env))
const loadedEnvKeys = new Set<string>()

const appEnvSchema = z.enum(['development', 'production'])
const nodeEnvSchema = z.enum(['development', 'production'])

const resolvedAppEnv = appEnvSchema
  .catch('development')
  .parse(process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development')

const resolvedNodeEnv = nodeEnvSchema
  .catch('development')
  .parse(process.env.NODE_ENV ?? resolvedAppEnv)

const envFiles = [
  '.env',
  `.env.${resolvedAppEnv}`,
  '.env.local',
  `.env.${resolvedAppEnv}.local`,
]

for (const fileName of envFiles) {
  const filePath = path.join(rootDir, fileName)

  if (!fs.existsSync(filePath)) {
    continue
  }

  const parsedValues = dotenv.parse(fs.readFileSync(filePath))

  for (const [key, value] of Object.entries(parsedValues)) {
    if (lockedEnvKeys.has(key) && !loadedEnvKeys.has(key)) {
      continue
    }

    process.env[key] = value
    loadedEnvKeys.add(key)
  }
}

process.env.APP_ENV = process.env.APP_ENV ?? resolvedAppEnv
process.env.NODE_ENV = process.env.NODE_ENV ?? resolvedNodeEnv

const envSchema = z.looseObject({
  PORT: z.coerce.number().int().min(1).max(65535).default(8000),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n')

  throw new Error(`Invalid environment configuration:\n${formattedErrors}`)
}

export const env = {
  ...parsedEnv.data,
  isDevelopment: parsedEnv.data.NODE_ENV === 'development',
  isProduction: parsedEnv.data.NODE_ENV === 'production',
} as const
