import axios from "axios"
import { initClientProject } from "./helper"

const app = initClientProject()

const BUNDLE_URL = 'UPLOADED_BUNDLE_URL'
const USE_BUNDLES = true

const main = async () => {
  await app.firestore().clearPersistence()

  const db = app.firestore()
  const now = Date.now()

  if (USE_BUNDLES) {
    const response = await axios.get(BUNDLE_URL)
    await db.loadBundle(response.data)

    const query = await db.namedQuery('bundles-query')
    const snaps = await query!.get({ source: 'cache' })
    console.log(`${snaps.size} docs fetched!`)
  } else {
    await db.collection('bundles').orderBy('timestamp', 'asc').get({ source: 'server' })
  }

  console.log(`${(Date.now() - now) / 1000}s`, `(use bundles: ${USE_BUNDLES})`)
  process.exit(0)
}

main()
