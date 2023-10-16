// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { initializeAuth, getReactNativePersistence } from "firebase/auth";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getAuth } from "firebase/auth";

// // Your web app's Firebase configuration

// // bot@kolabora.com
// const firebaseConfig = {
//   apiKey: process.env.EXPO_PUBLIC_GOOGLE_API,
//   authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
//   projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
//   storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
//   appId: process.env.EXPO_PUBLIC_APP_ID,
// };

// // Initialize Firebase
// let auth;
// if (firebaseConfig?.projectId) {
//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage),
//   });

//   if (app.name && typeof window !== "undefined") {
//     auth = getAuth(app);
//   }
// }

// export { auth };
