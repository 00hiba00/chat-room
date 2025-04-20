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
  
  

  const viewProfile = () => {
    console.log('User ID:', props.user.uid); 

  router.push({ name: 'profile', params: { userId: props.user.uid } });
};

  
  
  </script>
  
  <style scoped>
.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 10px;
}

.status-indicator.online {
  background-color: green;
}

.status-indicator.offline {
  background-color: red;
}
  </style>
  