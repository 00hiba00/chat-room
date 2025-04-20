import { ref } from 'vue';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase.js';



const userProfile = ref(null);

export function useFirestore() {
  const fetchUserProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid); 
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        userProfile.value = userDoc.data();
      } else {
        console.error('No such document!');
      }
    }
  };

  const updateUserProfile = async (name, photoURL) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { name, photoURL }, { merge: true });
      userProfile.value = { ...userProfile.value, name, photoURL };
    }
  };

  return { userProfile, fetchUserProfile, updateUserProfile };
}