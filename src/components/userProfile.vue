<template>
    <div>
      <b-card class="mb-3">
        <b-card-header>
          <h3>Profil Utilisateur</h3>
        </b-card-header>
        <b-card-body>
          <b-form @submit.prevent="handleSubmit">
            <b-form-group label="Nom" label-for="name">
              <b-form-input
                id="name"
                v-model="name"
                type="text"
                required
              />
            </b-form-group>
  
            <b-form-group label="Photo de Profil" label-for="photoURL">
              <b-form-input
                id="photoURL"
                v-model="photoURL"
                type="text"
                placeholder="URL de la photo de profil"
              />
            </b-form-group>
  
            <b-button type="submit" variant="primary">Mettre à jour</b-button>
          </b-form>
  
          
        </b-card-body>
      </b-card>
  
      <b-card v-if="userProfile" class="mt-3">
        <b-card-header>Informations Profil</b-card-header>
        <b-card-body>
          <p><strong>Nom:</strong> {{ userProfile.name }}</p>
          <p><strong>Email:</strong> {{ userProfile.email }}</p>
          <p><strong>Photo:</strong> <img :src="userProfile.photoURL" alt="User Photo" width="100" /></p>
        </b-card-body>
      </b-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useFirestore } from '../composables/useFirestore'; 
  
  const { userProfile, fetchUserProfile, updateUserProfile } = useFirestore();
  
  const name = ref('');
  const photoURL = ref('');
  const email = ref('');
  
  const handleSubmit = async () => {
    await updateUserProfile(name.value, photoURL.value);
    alert('Profil mis à jour avec succès!');
  };
  
  onMounted(async () => {
    await fetchUserProfile();
    if (userProfile.value) {
      name.value = userProfile.value.name;
      photoURL.value = userProfile.value.photoURL || '';
      email.value = userProfile.value.email;
     
    }
  });
  </script>
  <style scoped>
.profile-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #f9f9fb;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-card,
.profile-info {
  border: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  margin-bottom: 2rem;
  background-color: white;
}

.b-card-header {
  background-color: #f1f3f5;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem;
  font-size: 1.25rem;
  color: #333;
}

.b-form-group {
  margin-bottom: 1.5rem;
}

.b-form-input {
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ced4da;
  transition: border-color 0.2s;
}

.b-form-input:focus {
  border-color: #007bff;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 1rem;
  border: 4px solid #dee2e6;
  transition: border-color 0.3s;
}

.profile-photo:hover {
  border-color: #007bff;
}

.b-button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border-radius: 50px;
  border: none;
  transition: background-color 0.3s;
  font-weight: 600;
}

.b-button:hover {
  background-color: #0056b3;
}

.profile-info p {
  font-size: 1.1rem;
  color: #555;
}

.profile-info p strong {
  color: #333;
}
</style>