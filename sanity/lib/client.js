import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = "2024-03-25"

// Create a write client with token
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // We need to bypass the CDN for write operations
})

// Keep the existing read-only client
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
