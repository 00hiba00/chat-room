<template>
    <b-card class="mb-2">
      <b-card-header>
        <h5>{{ user.name }}</h5>
      </b-card-header>
      <b-card-body>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <span class="status-indicator" :class="{ online: user.status, offline: !user.status }"></span>

        <!-- Add buttons for interacting with the user, like viewing their profile or starting a conversation -->
        <b-button @click="viewProfile" variant="outline-primary">View Profile</b-button>
      </b-card-body>
    </b-card>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  import { useRouter } from 'vue-router';
  
  const props = defineProps({
    user: {
      type: Object,
      required: true
    }
  });
  
  const router = useRouter();
  
  // Function to navigate to the user's profile page
  
// Function to navigate to the user's profile page

  const viewProfile = () => {
    console.log('User ID:', props.user.uid); // Add this for debugging

  // Navigate to ProfileCard.vue with the userId parameter
  router.push({ name: 'profile', params: { userId: props.user.uid } });
};

  
  // Function to start a conversation with the user (you can implement private messaging)
  
  </script>
  
  <style scoped>
.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 10px;
}

/* Online status */
.status-indicator.online {
  background-color: green;
}

/* Offline status */
.status-indicator.offline {
  background-color: red;
}
  </style>
  