<template>
    <div>
      <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
      <b-form @submit.prevent="handleSubmit">
        <b-form-group v-if="!isLogin" label="Nom">
            <b-form-input v-model="name" required />
        </b-form-group>

        <b-form-group label="Email">
          <b-form-input v-model="email" type="email" required />
        </b-form-group>
  
        <b-form-group label="Mot de passe">
          <b-form-input v-model="password" type="password" required />
        </b-form-group>
  
        <b-button type="submit" variant="primary">
          {{ isLogin ? 'Se connecter' : "S 'inscrire" }}
        </b-button>
  
        <b-button v-if="isLogin" variant="link" @click="reset">
          Mot de passe oublié ?
        </b-button>
  
        <b-alert variant="danger" v-if="error" class="mt-3">{{ error }}</b-alert>
      </b-form>
    </div>
  </template>
  
<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'


const props = defineProps({
  isLogin: Boolean // true pour login, false pour register
})

const email = ref('')
const password = ref('')
const name = ref('') 
const { login, register, resetPassword, error } = useAuth()

const handleSubmit = async () => {
console.log("Registering with:", email.value, password.value);
  if (props.isLogin) {
    await login(email.value, password.value)
  } else {
    await register(email.value, password.value, name.value)
  }
  
}

const reset = async () => {
  if (email.value) {
    await resetPassword(email.value)
    alert('Un e-mail de réinitialisation a été envoyé.')
  } else {
    alert('Veuillez entrer votre e-mail.')
  }
}
</script>
  
<style scoped>
.auth-container {
  max-width: 420px;
  margin: 3rem auto;
  padding: 2.5rem;
  border-radius: 16px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.auth-container:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
}

.b-form-group {
  margin-bottom: 1.5rem;
}

.b-form-input {
  border-radius: 8px;
  border: 1px solid #ccc;
  padding: 0.6rem 0.8rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.b-form-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.b-button {
  width: 100%;
  padding: 0.6rem;
  margin-top: 1rem;
  border-radius: 8px;
  background: linear-gradient(90deg, #007bff, #0056b3);
  color: #fff;
  border: none;
  font-weight: 600;
  transition: background 0.3s ease;
}

.b-button:hover {
  background: linear-gradient(90deg, #0056b3, #004085);
}

.b-button[variant="link"] {
  background: none;
  color: #007bff;
  padding: 0;
  margin-top: 0.8rem;
  text-align: center;
  display: block;
}

.b-button[variant="link"]:hover {
  text-decoration: underline;
}

.b-alert {
  border-radius: 8px;
  padding: 0.8rem 1rem;
  font-weight: 500;
  text-align: center;
}
</style>