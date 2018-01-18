import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyBVX0bF9F7GctUKusWSpAHZLMrwfOyUXQk',
  authDomain: 'watermelon-1bf6c.firebaseapp.com',
  databaseURL: 'https://watermelon-1bf6c.firebaseio.com',
  projectId: 'watermelon-1bf6c',
  storageBucket: 'watermelon-1bf6c.appspot.com',
  messagingSenderId: '408353710844'
}

firebase.initializeApp(config)
export default firebase
