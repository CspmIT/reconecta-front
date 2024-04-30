import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'
const firebaseConfig = {
    apiKey: 'AIzaSyDkm6kKyrmNFWqMK51SwGB9I52sUzZHnPg',
    authDomain: 'reconectadesarrollo.firebaseapp.com',
    projectId: 'reconectadesarrollo',
    storageBucket: 'reconectadesarrollo.appspot.com',
    messagingSenderId: '389460948556',
    appId: '1:389460948556:web:45500e6d3bc986130566e9',
    measurementId: 'G-RM6K3FBM4H'
}
const app = initializeApp(firebaseConfig)
export const messaging = getMessaging(app)
