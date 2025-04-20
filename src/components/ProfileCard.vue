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
  <style scoped>
.profile-container {
  max-width: 700px;
  margin: 3rem auto;
  padding: 1.5rem;
  background: #f9f9fb;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.profile-card {
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.b-card-header {
  background-color: #f1f3f5;
  border-bottom: 1px solid #dee2e6;
  border-radius: 8px 8px 0 0;
}

.profile-image {
  border: 4px solid #e9ecef;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 150px;
  margin-bottom: 1rem;
}

.b-button {
  margin-bottom: 1.5rem;
  padding: 0.6rem 1.4rem;
  background-color: #007bff;
  border: none;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.b-button:hover {
  background-color: #0056b3;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.b-card-body p {
  font-size: 1rem;
  color: #333;
}

.b-alert {
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
}
</style>