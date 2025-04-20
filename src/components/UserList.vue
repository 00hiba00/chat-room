<template>
<div>
<b-input-group class="mb-3">
  <b-form-input 
    v-model="searchQuery" 
    placeholder="Rechercher un utilisateur..." 
  />

</b-input-group>

<div v-if="users.length === 0" class="text-center">
        <b-alert show variant="info">
          Aucun user.
        </b-alert>
        
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
import { ref, computed } from 'vue';
import UserItem from './UserItem.vue';

import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';



//ajout
const searchQuery = ref('');



const filteredUsers = computed(() => {
  let filtered = user.value;

  // Filtre par mots-clés
  if (searchQuery.value) {
    filtered = filtered.filter(d =>
      d.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (d.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  }

  

  return filtered;
});
//fin







</script>
