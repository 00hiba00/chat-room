<template>
  <div>
    <router-link to="/Principale">
      <b-button>Retour</b-button>
    </router-link>
    <b-input-group class="mb-3">
      <b-form-input 
        v-model="searchQuery" 
        placeholder="Rechercher un utilisateur..." 
      />
    </b-input-group>

    <div v-if="users.length === 0" class="text-center">
      <b-alert show variant="info">Aucun utilisateur trouvé.</b-alert>
    </div>

    <div v-else>
      <br>
      <UserItem 
        v-for="user in filteredUsers" 
        :key="user.id" 
        :user="user" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import UserItem from './UserItem.vue';
import { db } from '../firebase/firebase'; 
import { collection, getDocs } from 'firebase/firestore';

const searchQuery = ref('');
const users = ref([]);

const filteredUsers = computed(() => {
  let filtered = users.value;

  if (searchQuery.value) {
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (d.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  }

  return filtered;
});

const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    users.value = querySnapshot.docs.map(doc => 
      ({uid: doc.id,  // This is the crucial part!
        ...doc.data()})
    );
  } catch (error) {
    console.error("Error fetching users: ", error);
  }
};

onMounted(() => {
  fetchUsers();
});
</script>
