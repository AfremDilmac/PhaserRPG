import {
	initializeApp
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
	getDatabase,
	set,
	ref,
	update
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	signOut
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import {
	getFirestore,
	collection,
	getDocs,
	updateDoc,
	addDoc,
	doc,
	setDoc
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth();

const db = getFirestore()
const colRef = collection(db, 'users')

//array van docs uitloggen 
getDocs(colRef)
	.then((snapshot) => {
		let users = []
		snapshot.docs.forEach((doc) => {
			users.push({
				...doc.data(),
				id: doc.id
			})
		})
		console.log(users);
	})
	.catch(err => {
		console.log(err.message);
	})


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

		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				// Signed in 
				const user = userCredential.user;

				set(ref(database, 'users/' + user.uid), {
					username: username,
					email: email
				})
				console.log(user.uid); // ID VAN AUTH
				localStorage.setItem("ID", user.uid)
				let ident = localStorage.getItem('ID')

				setDoc(doc(db, "users", ident), {
					name: username,
					gold: 0,
					health: 50,
					positionX: 90,
					positionY: 3159,
				});

				
				// db.collection('users').doc('nphuFFSC7TafmI66bs5gzIlbZLo1').update({
				// 	health: 999
				// })

			})
		signupBtn.style.display = 'none'
		gotoLogin.style.display = 'block'

		lblError.innerHTML = 'user created!'

	})
	.catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;

		lblError.innerHTML = errorCode
		// ..
	});


let i = localStorage.getItem('ID')
const docRef = doc(db, 'users', i)

function updatePlayer(){
	
	let a = localStorage.getItem('gold:')
	let b = localStorage.getItem('health')
	let c = localStorage.getItem('positionX')
	let d = localStorage.getItem('positionY')

	docRef.updateDoc(docRef, {
		gold: a,
		health: b,
		positionX: c,
		positionY: d,
	})
}


















































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