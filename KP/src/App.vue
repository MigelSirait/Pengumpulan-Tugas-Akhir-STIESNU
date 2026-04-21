<template>
  <div>
    <div v-if="isLoginView" class="vh-100" style="background: #141923;">
      <router-view />
    </div>
    <component v-else :is="layoutComponent" :username="username" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LayoutAdmin from './components/LayoutAdmin.vue'
import LayoutStaff from './components/LayoutStaff.vue'
import LayoutMahasiswa from './components/LayoutMahasiswa.vue'

const route = useRoute()
const username = ref('')
const role = ref('Mahasiswa')
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const normalizeStoredValue = (value: string | null, fallback = '') => {
  if (!value) return fallback
  const trimmed = value.trim()
  if (trimmed === 'undefined' || trimmed === 'null' || trimmed === '') return fallback
  return trimmed
}

const fetchProfile = async (storedUsername: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/users/${encodeURIComponent(storedUsername)}`)
    if (!response.ok) return ''
    const result = await response.json()
    const user = result.user || {}
    if (user.role === 'admin') role.value = 'Admin'
    else if (user.role === 'staf') role.value = 'Staf Akademik'
    else role.value = 'Mahasiswa'

    const nameToStore = normalizeStoredValue(user.nama, user.username || storedUsername)
    sessionStorage.setItem('simtama-name', nameToStore)

    const roleToStore = normalizeStoredValue(user.role, 'mahasiswa')
    sessionStorage.setItem('simtama-role', roleToStore)

    return nameToStore
  } catch (error) {
    console.error('Gagal mengambil profile:', error)
    return ''
  }
}

const updateUserRole = async () => {
  const storedUsername = normalizeStoredValue(sessionStorage.getItem('simtama-username') || sessionStorage.getItem('simtama-user'))
  const storedName = normalizeStoredValue(sessionStorage.getItem('simtama-name'))
  const storedRole = normalizeStoredValue(sessionStorage.getItem('simtama-role'), 'mahasiswa')

  if (storedRole === 'admin') role.value = 'Admin'
  else if (storedRole === 'staf') role.value = 'Staf Akademik'
  else role.value = 'Mahasiswa'

  if (storedUsername) {
    const profileName = await fetchProfile(storedUsername)
    username.value = profileName || storedName || storedUsername
  } else {
    username.value = storedName
  }
}

const isLoginView = computed(() => route.name === 'Login')

const layoutComponent = computed(() => {
  if (role.value === 'Admin') return LayoutAdmin
  if (role.value === 'Staf Akademik') return LayoutStaff
  return LayoutMahasiswa
})

onMounted(updateUserRole)
watch(() => route.fullPath, updateUserRole)
</script>

<style>
/* Global styles */
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.95rem;
  color: #2e3338;
  background: #f4f6fb;
}

* {
  --bs-body-font-size: 0.95rem;
}

/* Make sure main wrappers remain readable */
.card, .navbar, .sidebar, .topbar, .container, .card-body {
  background-clip: padding-box;
}

/* Consistency in text color */
.text-gray-600 {
  color: #858796 !important;
}

.text-gray-400 {
  color: #b8b9be !important;
}

/* Button styling */
.btn-link {
  color: #4e73df;
  text-decoration: none;
}

.btn-link:hover {
  color: #2e59a7;
}

/* Default card styling */
.card {
  border: none;
  border-radius: 0.35rem;
  box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
}

.card-header {
  border-bottom: 1px solid #e3e6f0;
  border-radius: 0.35rem 0.35rem 0 0;
  background-color: #f8f9fc;
  border: none;
}

.card-footer {
  border-top: 1px solid #e3e6f0;
  border-radius: 0 0 0.35rem 0.35rem;
}
</style>
