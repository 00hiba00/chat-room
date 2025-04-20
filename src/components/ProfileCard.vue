<template>
    <div>
      <router-link to="/SearchUser">
        <b-button>Retour</b-button>
      </router-link>
  
      <b-card v-if="userData">
        <b-card-header>
          <h3>{{ userData.name }}'s Profile</h3>
        </b-card-header>
  
        <b-card-body class="text-center">
          <b-img
            :src="userData.photoURL || 'https://via.placeholder.com/150'"
            fluid
            rounded
            alt="Profile Picture"
            class="mb-3"
            style="max-width: 150px;"
          />
          <p><strong>Email:</strong> {{ userData.email }}</p>
          <p>
            <strong>Status:</strong>
            <span :class="userData.status ? 'text-success' : 'text-danger'">
              {{ userData.status ? 'Online' : 'Offline' }}
            </span>
          </p>
          
        </b-card-body>
      </b-card>
  
      <b-alert v-else show variant="info">Loading user profile...</b-alert>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '@/firebase/firebase.js';
  
  const props = defineProps({
    userId: {
      type: String,
      required: true
    }
  });
  
  const userData = ref(null);
  
  onMounted(async () => {
    try {
      const userRef = doc(db, 'users', props.userId);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        userData.value = userSnap.data();
      } else {
        console.log("No such user!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  });
  
  
  </script>
  