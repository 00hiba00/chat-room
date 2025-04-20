<template>
    <div>
        <h2>Mon Profil</h2>
        <user-profile></user-profile>
        <router-link to="/Discussion">go to discussions</router-link>
    </div>
</template>

<script setup>
    import UserProfile from '../components/userProfile.vue';
</script>
