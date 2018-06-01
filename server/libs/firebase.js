import firebase from 'firebase';
import 'firebase/firestore';

export function firebaseInit(context) {
    context.callbackWaitsForEmptyEventLoop = false;  //<---Important

    firebase.initializeApp( {
        apiKey: 'AIzaSyD91F7xbasp2zPh633X_L7_1Js0IB5BVi8',
        authDomain: 'premiergeek-3c409.firebaseapp.com',
        projectId: 'premiergeek-3c409'// databaseURL: "https://premiergeek-3c409.firebaseio.com",
        // storageBucket: "premiergeek-3c409.appspot.com",
    });

    return firebase.firestore()

}
