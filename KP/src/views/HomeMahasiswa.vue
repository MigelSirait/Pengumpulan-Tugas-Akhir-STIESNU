<template>
  <div class="container-fluid home-page-container">
    <div class="row mb-4 pt-4">
      <div class="col-md-12">
        <h5 class="mb-2 text-dark" style="font-weight: 600;">Halo, {{ username }} ({{ role }})</h5>
        <p class="text-muted small mb-0">Pantau progres penyelesaian tugas akhir dan kumpulkan berkas Anda dari sini.</p>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-3 mb-3" v-for="step in steps" :key="step.id">
        <div class="card border-start border-4 shadow-sm h-100 py-2" :class="{
          'border-primary': step.statusClass === 'primary',
          'border-success': step.statusClass === 'success',
          'border-info': step.statusClass === 'info',
          'border-warning': step.statusClass === 'warning',
          'border-secondary': step.statusClass === 'secondary'
        }">
          <div class="card-body pb-2">
            <div class="fw-bold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">{{ step.title }}</div>
            <div class="h6 mb-0" :class="stepTextClass(step.statusClass)">{{ step.status }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-7 mb-4">
        <div class="card shadow-sm">
          <div class="card-header py-3 bg-white border-bottom">
            <h6 class="m-0 fw-bold text-success" style="font-size: 1rem;"><i class="fas fa-tasks"></i> Progres Pengumpulan Tugas Akhir</h6>
          </div>
          <div class="card-body" style="padding: 1.25rem;">
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-1"><small style="font-size: 0.85rem;">Overall Progress</small><small style="font-size: 0.85rem;">{{ progressPercent }}%</small></div>
              <div class="progress" style="height: 12px;">
                <div class="progress-bar bg-success" role="progressbar" :style="{ width: progressPercent + '%' }" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>

            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center py-3" v-for="step in steps" :key="step.id">
                <div>
                  <strong style="font-size: 0.95rem;">{{ step.title }}</strong>
                  <div class="small text-muted mt-1" style="font-size: 0.85rem;">{{ step.description }}</div>
                </div>
                <span :class="['badge', 'bg-' + step.statusClass, step.statusClass === 'secondary' ? 'text-dark' : 'text-white']" style="font-size: 0.8rem; padding: 0.4rem 0.6rem;">{{ step.status }}</span>
              </li>
            </ul>
          </div>
          <div class="card-footer bg-light text-muted" style="font-size: 0.85rem; padding: 0.75rem 1.25rem;">Data diperbarui secara otomatis. <span>{{ updatedAt }}</span></div>
        </div>
      </div>

      <div class="col-md-5 mb-4">
        <div class="card shadow-sm">
          <div class="card-header py-3 bg-white border-bottom" @click="toggleComments" style="cursor: pointer;">
            <div class="d-flex justify-content-between align-items-center">
              <h6 class="m-0 fw-bold text-info" style="font-size: 1rem;"><i class="fas fa-comments"></i> Komentar Staf Akademik</h6>
              <span class="badge bg-info text-white ms-2">{{ commentsCount }}</span>
            </div>
          </div>
          <div v-if="showComments" class="collapse show">
            <div class="card-body" style="padding: 1rem; max-height: 300px; overflow-y: auto;">
              <div v-if="comments.length === 0" class="text-center text-muted" style="font-size: 0.9rem;">
                Belum ada komentar dari staf akademik.
              </div>
              <div v-else v-for="comment in comments" :key="comment.id" class="mb-2 pb-2 border-bottom" style="font-size: 0.9rem;">
                <div class="d-flex">
                  <div class="flex-shrink-0">
                    <img class="rounded-circle" src="https://via.placeholder.com/32" alt="Avatar" style="width: 32px; height: 32px;">
                  </div>
                  <div class="flex-grow-1 ms-2">
                    <div class="fw-bold" style="font-size: 0.9rem;">{{ comment.author }}</div>
                    <div class="text-muted" style="font-size: 0.8rem;">{{ comment.date }}</div>
                    <p class="mb-0 text-break" style="font-size: 0.85rem;">{{ comment.text }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const username = ref('')
const role = ref('Mahasiswa')
const progressPercent = ref(25)
const updatedAt = ref('2 menit yang lalu')
const showComments = ref(true)

const normalizeStoredUser = (value: string | null) => {
  if (!value) return ''
  const trimmed = value.trim()
  return trimmed === 'undefined' || trimmed === 'null' ? '' : trimmed
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
    return user.nama || user.username || ''
  } catch (error) {
    console.error('Gagal mengambil profile:', error)
    return ''
  }
}

onMounted(async () => {
  const storedUsername = normalizeStoredUser(sessionStorage.getItem('simtama-username') || sessionStorage.getItem('simtama-user'))
  const storedName = normalizeStoredUser(sessionStorage.getItem('simtama-name'))

  if (storedUsername) {
    const profileName = await fetchProfile(storedUsername)
    username.value = profileName || storedName || storedUsername || 'Mahasiswa'
  } else {
    username.value = storedName || 'Mahasiswa'
  }
})

const steps = ref([
  { id: 'outline', title: 'Outline', description: 'Pengajuan outline skripsi', status: 'Selesai', statusClass: 'success' },
  { id: 'pengajuan_proposal', title: 'Pengumpulan Proposal', description: 'Upload dan pengumpulan proposal', status: 'Dalam Proses', statusClass: 'warning' },
  { id: 'seminar_proposal', title: 'Seminar Proposal', description: 'Pelaksanaan seminar proposal', status: '—', statusClass: 'secondary' },
  { id: 'pengajuan_skripsi', title: 'Pengumpulan Skripsi', description: 'Lengkapi judul final dan kumpulkan berkas skripsi', status: '—', statusClass: 'secondary' },
  { id: 'seminar_hasil', title: 'Seminar Hasil', description: 'Pelaksanaan seminar hasil', status: '—', statusClass: 'secondary' },
  { id: 'sidang', title: 'Sidang Skripsi', description: 'Pelaksanaan sidang akhir', status: '—', statusClass: 'secondary' }
])

const comments = ref([
  { id: 1, author: 'Staf Akademik', date: '1 Apr 2026', text: 'Mohon lengkapi berkas proposal Anda.' },
  { id: 2, author: 'Staf Akademik', date: '31 Mar 2026', text: 'Jadwal seminar proposal segera diumumkan.' }
])

const commentsCount = computed(() => comments.value.length)

const toggleComments = () => {
  showComments.value = !showComments.value
}

const stepTextClass = (statusClass: string) => {
  if (statusClass === 'success') return 'text-success'
  if (statusClass === 'warning') return 'text-warning'
  if (statusClass === 'info') return 'text-info'
  return 'text-secondary'
}
</script>
