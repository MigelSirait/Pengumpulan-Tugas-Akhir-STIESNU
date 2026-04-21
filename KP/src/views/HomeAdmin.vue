<template>
  <div class="container-fluid home-page-container">
    <div class="row mb-4 pt-4">
      <div class="col-md-12">
        <h5 class="mb-2 text-dark" style="font-weight: 600;">Halo, {{ username }} ({{ role }})</h5>
        <p class="text-muted small mb-0">Kelola sistem secara keseluruhan.</p>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <div class="card border-start border-4 border-primary shadow-sm h-100 py-2">
          <div class="card-body pb-2">
            <div class="text-primary fw-bold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">Total Mahasiswa</div>
            <div class="h6 mb-0 text-primary fw-bold">150</div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card border-start border-4 border-success shadow-sm h-100 py-2">
          <div class="card-body pb-2">
            <div class="text-success fw-bold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">Total Staf</div>
            <div class="h6 mb-0 text-success fw-bold">10</div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card border-start border-4 border-info shadow-sm h-100 py-2">
          <div class="card-body pb-2">
            <div class="text-info fw-bold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">Tugas Akhir Selesai</div>
            <div class="h6 mb-0 text-info fw-bold">45</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="card shadow-sm">
          <div class="card-header py-3 bg-white border-bottom">
            <h6 class="m-0 fw-bold text-primary" style="font-size: 1rem;"><i class="fas fa-cogs"></i> Manajemen Sistem</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4 mb-3">
                <button class="btn btn-primary w-100">Kelola Pengguna</button>
              </div>
              <div class="col-md-4 mb-3">
                <button class="btn btn-success w-100">Laporan</button>
              </div>
              <div class="col-md-4 mb-3">
                <button class="btn btn-info w-100">Pengaturan Sistem</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const username = ref('')
const role = ref('Admin')

const normalizeStoredValue = (value: string | null, fallback: string) => {
  if (!value) return fallback
  const trimmed = value.trim()
  if (trimmed === 'undefined' || trimmed === 'null' || trimmed === '') return fallback
  return trimmed
}

onMounted(() => {
  const storedName = normalizeStoredValue(sessionStorage.getItem('simtama-name'), '')
  username.value = storedName || normalizeStoredValue(sessionStorage.getItem('simtama-user'), 'Admin')

  const storedRole = normalizeStoredValue(sessionStorage.getItem('simtama-role'), 'admin').toLowerCase()
  if (storedRole === 'admin') role.value = 'Admin'
  else if (storedRole === 'staf') role.value = 'Staf Akademik'
})
</script>
