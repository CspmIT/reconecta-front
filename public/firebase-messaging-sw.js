importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js')

const firebaseConfig = {
    apiKey: 'AIzaSyDkm6kKyrmNFWqMK51SwGB9I52sUzZHnPg',
    authDomain: 'reconectadesarrollo.firebaseapp.com',
    projectId: 'reconectadesarrollo',
    storageBucket: 'reconectadesarrollo.appspot.com',
    messagingSenderId: '389460948556',
    appId: '1:389460948556:web:45500e6d3bc986130566e9',
    measurementId: 'G-RM6K3FBM4H'
}

const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging(app)

messaging.onBackgroundMessage((payload) => {
    console.log('recibiste un mensaje')
    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
        icon: './assets/react.svg'
    }

    return self.registration.showNotification(notificationTitle, notificationOptions)
})
