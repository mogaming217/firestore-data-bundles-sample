import { firestore, storage } from "firebase-admin"
import { initAdminProject } from "./helper"
import * as fs from 'fs'

initAdminProject()

const BUCKET_NAME = 'YOUR_BUCKET_NAME'
const CREATE_INITIAL_DATA = false

const main = async () => {
  const db = firestore()
  const timestamp = Date.now()

  if (CREATE_INITIAL_DATA) {
    // 100件データを作成
    await Promise.all([...Array(100)].map((_, i) => {
      return db.doc(`bundles/data_${i}`).set({
        body: `${i}`.repeat(1000).slice(0, 1000),
        timestamp: firestore.Timestamp.fromMillis(timestamp + i * 100)
      })
    }))
  }

  const snapshots = await db.collection('bundles').orderBy('timestamp', 'asc').limit(82).get()
  const buffer = await db.bundle(timestamp.toString()).add('bundles-query', snapshots).build()
  const bundledFilePath = `./${timestamp}.txt`
  fs.writeFileSync(bundledFilePath, buffer)
  const destination = `firestore-data-bundles/bundles.txt`
  await storage().bucket(BUCKET_NAME).upload(bundledFilePath, { destination, public: true, metadata: { cacheControl: `public, max-age=60` } })
  console.log(`uploaded to https://storage.googleapis.com/${BUCKET_NAME}/${destination}`)

  process.exit(0)
}

main()
