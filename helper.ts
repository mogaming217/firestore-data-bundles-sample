import { initializeApp, credential } from 'firebase-admin'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/firestore/bundle'

export const initAdminProject = () => {
  const serviceAccount = require('./serviceAccount.json')
  return initializeApp({ credential: credential.cert(serviceAccount) })
}

export const initClientProject = () => {
  const firebaseConfig = {
    projectId: "nextjssample",
  }

  return firebase.initializeApp(firebaseConfig)
}
