<template>
  <div class="login-screen d-flex justify-content-center align-items-center vh-100">
    <div class="card p-4 login-box" style="width: 360px;">      <h4 class="text-center mb-3">STIESNU Bengkulu</h4>
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input v-model="username" id="username" type="text" class="form-control" placeholder="Masukkan username" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input v-model="password" id="password" type="password" class="form-control" placeholder="Masukkan password" />
      </div>
      <div class="d-grid">
        <button @click="login" class="btn btn-primary">Login</button>
      </div>
      <p class="mt-3 text-muted small">Gunakan: admin/admin, staf/staf, atau mahasiswa/1234</p>
      <div v-if="error" class="alert alert-danger mt-2 py-1" role="alert">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const login = async () => {
  error.value = ''
  if (!username.value || !password.value) {
    error.value = 'Username dan password wajib diisi'
    return
  }

  try {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value.trim(),
        password: password.value.trim()
      })
    })

    const result = await response.json()

    if (!response.ok) {
      error.value = result.message || 'Login gagal. Periksa kembali kredensial Anda.'
      return
    }

    const user = result.user || {}
    const usernameValue = user.username || username.value.trim()
    const nameValue = user.nama || usernameValue
    const roleValue = user.role || 'mahasiswa'

    sessionStorage.setItem('simtama-auth', 'true')
    sessionStorage.setItem('simtama-username', usernameValue)
    sessionStorage.setItem('simtama-user', usernameValue)
    sessionStorage.setItem('simtama-name', nameValue)
    sessionStorage.setItem('simtama-role', roleValue)
    router.replace('/home')
  } catch (err) {
    error.value = 'Tidak dapat terhubung ke server backend. Pastikan backend berjalan.'
    console.error(err)
  }
}
</script>

<style scoped>
.login-screen {
  background: radial-gradient(circle at 20% 20%, #14362f, #0b1219 70%);
  width: 100vw;
  height: 100vh;
}

.login-box {
  box-shadow: 0 0.75rem 1.5rem rgba(0,0,0,.35);
}

.card {
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 0.75rem;
}
</style>