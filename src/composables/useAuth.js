// src/composables/useAuth.js
import { ref } from 'vue'
import { auth, db } from '../firebase/firebase.js'
import { doc, setDoc, updateDoc } from 'firebase/firestore'  // Import Firestore methods
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth'
import { useRouter } from 'vue-router'


const error = ref(null)
const currentUser = ref(null)

onAuthStateChanged(auth, (u) => {
  currentUser.value = u
})


export function useAuth() {
    const router = useRouter();
    
    const register = async (email, password, name) => {
    error.value = null
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        await setDoc(doc(db, 'users', user.uid), {
            name: name,                  // User name
            email: email,       // User email
            photoURL: '',
            status:true,       // Add default photo or leave it empty
          })
          console.log('User successfully registered and added to Firestore.')
          router.push('/Profile')
    } catch (err) {
      error.value = err.message
      console.error("Firebase Error:", err.code, err.message)
    }
  }

  const login = async (email, password) => {
    error.value = null
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userRef = doc(db, 'users', user.uid);
  
      await updateDoc(userRef, {
        status: true
      });
  
      router.push('/Profile')
    } catch (err) {
      alert("mot de passe ou email incorrect")
      error.value = err.message
      console.error("Login error: ", err.message);
    }
  }
  

  const logout = async () => {
    // Update status BEFORE signing out
    const user = auth.currentUser
    if (user) {
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, { status: false })
    }
    await signOut(auth);
    
    
    }
  

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      
    } catch (err) {
      error.value = err.message
      console.error("Login error: ", error.message);
    }
  }

  return {
    register,
    login,
    logout,
    resetPassword,
    error,
    user: currentUser  // 👈 ajoute ceci
  }
}
