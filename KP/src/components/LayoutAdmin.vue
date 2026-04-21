<template>
  <div id="wrapper" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <li class="nav-item mt-2 d-md-none">
        <a class="nav-link" href="#" @click.prevent="toggleSidebar" style="padding: 0.5rem;">
          <svg v-if="sidebarCollapsed" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg">
            <path d="M4 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg">
            <path d="M12 3l-5 5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </li>

      <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/" v-if="!sidebarCollapsed">
        <div class="sidebar-brand-icon">
          <img :src="logo" alt="Logo" style="max-width: 2.5rem; height: auto; object-fit: contain;">
        </div>
        <div class="sidebar-brand-text mx-2">STIESNU <sup>Bengkulu</sup></div>
      </a>

      <hr class="sidebar-divider my-0">

      <li class="nav-item" :class="{ active: route.path.startsWith('/home') }">
        <router-link class="nav-link" :to="homeRoute" :title="sidebarCollapsed ? 'Home' : ''">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg">
            <path d="M8.5 1.5l6 5.5v7a.5.5 0 0 1-.5.5H10v-5H6v5H2a.5.5 0 0 1-.5-.5v-7l6-5.5a.5.5 0 0 1 .5 0z"/>
          </svg>
          <span v-if="!sidebarCollapsed">Home</span>
        </router-link>
      </li>

      <hr class="sidebar-divider">
      <div class="sidebar-heading" v-if="!sidebarCollapsed">
        Data
      </div>

      <li class="nav-item">
        <router-link class="nav-link" to="/data-mahasiswa">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg">
            <path d="M8 0C6.895 0 6 1.12 6 2.5S6.895 5 8 5s2-1.12 2-2.5S9.105 0 8 0zm4 3.5c0 1.235-1.192 2.44-2.595 3.42A4.99 4.99 0 0 1 8 8c-1.032 0-1.99-.27-2.905-.78C4.192 5.94 3 4.735 3 3.5 3 1.568 5.148 0 8 0s5 1.568 5 3.5z"/>
            <path d="M1 14s1-4 7-4 7 4 7 4v1H1v-1z"/>
          </svg>
          <span v-if="!sidebarCollapsed">Data Mahasiswa</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/data-staf">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg">
            <path d="M5.5 3a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm5 0a2.5 2.5 0 1 1 .001 5.001A2.5 2.5 0 0 1 10.5 3z"/>
            <path d="M0 13s1-4 8-4 8 4 8 4v1H0v-1z"/>
          </svg>
          <span v-if="!sidebarCollapsed">Data Staf</span>
        </router-link>
      </li>

      <li class="nav-item" v-if="!sidebarCollapsed">
        <a
          class="nav-link collapsed"
          href="#"
          @click.prevent="tugasAkhirOpen = !tugasAkhirOpen"
          aria-expanded="false"
          aria-controls="collapseTugas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg">
            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h8A1.5 1.5 0 0 1 12 2.5v11A1.5 1.5 0 0 1 10.5 15h-8A1.5 1.5 0 0 1 1 13.5v-11zm1.5-.5a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5H10.5a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-.5-.5H2.5z"/>
            <path d="M3 4h6v1H3V4zm0 2h6v1H3V6zm0 2h6v1H3V8z"/>
          </svg>
          <span>Tugas Akhir</span>
          <span class="ms-auto">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg" :style="{ transform: tugasAkhirOpen ? 'rotate(180deg)' : 'rotate(0deg)' }">
              <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </a>
        <div v-if="tugasAkhirOpen" id="collapseTugas" class="collapse show">
          <div class="bg-transparent py-2 collapse-inner rounded">
            <router-link class="collapse-item" to="/admin/tugas-akhir/outline">Penyimpanan Outline Skripsi</router-link>
            <router-link class="collapse-item" to="/admin/tugas-akhir/pengajuan-proposal">Penyimpanan Proposal</router-link>
            <router-link class="collapse-item" to="/admin/tugas-akhir/pengajuan-skripsi">Pengumpulan Skripsi</router-link>
          </div>
        </div>
      </li>

      <hr class="sidebar-divider mt-auto">
      <li class="nav-item">
        <a class="nav-link" href="#" @click.prevent="logout">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg">
            <path d="M6 2a1 1 0 0 0-1 1v3H4V3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3h1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6z"/>
            <path d="M4.5 8l3-3v2H12v2H7.5v2l-3-3z"/>
          </svg>
          <span v-if="!sidebarCollapsed">Logout</span>
        </a>
      </li>
    </ul>

    <div id="content-wrapper" class="d-flex flex-column">
      <div id="content" class="flex-grow-1 d-flex flex-column">
        <nav class="navbar navbar-expand navbar-light bg-white topbar static-top border-bottom" style="box-shadow: 0 .125rem .25rem rgba(0,0,0,.075); margin-bottom: 1.25rem;">
          <button id="sidebarToggleTop" class="btn btn-link d-md-none rounded-circle me-3" @click="toggleSidebar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg">
              <path d="M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z"/>
            </svg>
          </button>

          <ul class="navbar-nav ms-auto">
            <li class="nav-item dropdown no-arrow">
              <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span class="me-2 d-none d-lg-inline text-dark" style="font-size: 0.9rem;">{{ username }}</span>
                <img class="img-profile rounded-circle" src="https://via.placeholder.com/32" style="width: 32px; height: 32px;">
              </a>
              <div class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                <a class="dropdown-item" href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg me-2 text-gray-400">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                    <path d="M2 14s1-4 6-4 6 4 6 4v1H2v-1z"/>
                  </svg>
                  Profile
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" @click="logout">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="icon-svg me-2 text-gray-400">
                    <path d="M6 2a1 1 0 0 0-1 1v3H4V3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3h1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H6z"/>
                    <path d="M4.5 8l3-3v2H12v2H7.5v2l-3-3z"/>
                  </svg>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </nav>

        <div class="container-fluid page-content-wrapper">
          <div class="page-content-container">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import logo from '@/assets/logostiesnu.png'

const props = defineProps({ username: { type: String, required: true } })
const username = props.username
const router = useRouter()
const route = useRoute()
const sidebarCollapsed = ref(false)
const tugasAkhirOpen = ref(false)

const homeRoute = computed(() => {
  const user = sessionStorage.getItem('simtama-user')
  if (user === 'admin') return { name: 'HomeAdmin' }
  if (user === 'staf') return { name: 'HomeStaff' }
  return { name: 'HomeMahasiswa' }
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const logout = () => {
  sessionStorage.removeItem('simtama-auth')
  sessionStorage.removeItem('simtama-user')
  sessionStorage.removeItem('simtama-username')
  sessionStorage.removeItem('simtama-name')
  sessionStorage.removeItem('simtama-role')
  router.push('/login')
}
</script>
