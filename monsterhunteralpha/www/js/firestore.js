import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
	apiKey: "AIzaSyAeBjdQt26lGPxqiuUeQvDGLiFfbEbYYS8",
    authDomain: "monsterhunter-d7680.firebaseapp.com",
    databaseURL: "https://monsterhunter-d7680-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "monsterhunter-d7680",
    storageBucket: "monsterhunter-d7680.appspot.com",
    messagingSenderId: "338059376056",
    appId: "1:338059376056:web:a1bb36e87101c4f2598b4d"
  };

  initializeApp(firebaseConfig)
  const db = getFirestore()
  //collection ref (users)
  const colRef = collection(db, 'users')

  //array van docs uitloggen 
  getDocs(colRef)
  	.then((snapshot) => {
		 let users = []
		 snapshot.docs.forEach((doc) => {
			 users.push({...doc.data(), id: doc.id})
		 })
		 console.log(users);
	  })
	  .catch(err => {
		  console.log(err.message);
	  })


// // nieuwe doc toevoegen in firestore bij signup 
// const sigupForm = document.querySelector('.left')
// sigupForm.addEventListener('submit', (e) => {
// 	e.preventDefault();

// 	addDoc(colRef, {
// 		mail: sigupForm.email.value ,
// 		name: sigupForm.username.value
// 	})
// 	.then( () =>{
// 		sigupForm.reset()
// 	})
// })


/////// FUNCTIE OM EEN DOC TE VERWIJDEREN /////////

// const docRef = doc(db, 'users', "hYjfLWZ9zzTO8G9EchHYNDTlONA3") // deleteForm = HTML form dat gemaakt moet worden / id = name propertie van input selector 
// // delete doc met gegeven id in form
// deleteDoc(docRef)
//   .then(() => {
// 	  deleteForm.reset()
//   })




  
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
//   
