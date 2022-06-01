const firebaseConfig = {
	apiKey: "AIzaSyAeBjdQt26lGPxqiuUeQvDGLiFfbEbYYS8",
	authDomain: "monsterhunter-d7680.firebaseapp.com",
	databaseURL: "https://monsterhunter-d7680-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "monsterhunter-d7680",
	storageBucket: "monsterhunter-d7680.appspot.com",
	messagingSenderId: "338059376056",
	appId: "1:338059376056:web:a1bb36e87101c4f2598b4d"
};

//Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();
const db = firebase.firestore();
const gotoLogin = document.getElementById('gotoLogin');
const signupBtn = document.getElementById('signUp');

gotoLogin.style.display = 'none'
// nieuwe doc toevoegen in firestore bij signup 
const sigupForm = document.querySelector('.left')

sigupForm.addEventListener('submit', (e) => {
	e.preventDefault();

	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	var username = document.getElementById('username').value;
	var lblError = document.getElementById('errormsg-signup')

	
	auth.createUserWithEmailAndPassword(email, password)
    .then(function () {
      db.collection('users').doc(auth.currentUser.uid)
        .set({
			gold: 0,
			health: 50,
			name: username,
			positionX: 90,
			positionY: 3159,
        })
		// localStorage.setItem("ID", auth.currentUser.uid)
		.then(() => {
			console.log("Document successfully written!");
		})
		.catch((error) => {
			console.error("Error writing document: ", error);
		});
    })
	.catch((error) => {
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorMessage + " " + errorCode);
	});


	signupBtn.style.display = 'none'
	gotoLogin.style.display = 'block'

	lblError.innerHTML = 'user created!'

})














































//doc uitloggen 
// const colRef = db.collection('users').doc(id....);
// colRef.get().then((doc) => {
// 	if (doc.exists) {       
// 		console.log(doc);
// 	}
// }).catch((error) => {
// 	console.log("Error getting document:", error);
// });


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



//  login.addEventListener('click',(e)=>{
//    var email = document.getElementById('email').value;
//    var password = document.getElementById('password').value;

//       signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Signed in 
//         const user = userCredential.user;

//         const dt = new Date();
//          update(ref(database, 'users/' + user.uid),{
//           last_login: dt,
//         })

//          alert('User loged in!');
//         // ...
//       })
//       .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;

//         alert(errorMessage);
//   });

//  });