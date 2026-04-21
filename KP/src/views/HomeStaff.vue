<template>
  <div class="container-fluid home-page-container">
    <div class="row mb-4 pt-4">
      <div class="col-md-12">
        <h5 class="mb-2 text-dark" style="font-weight: 600;">Halo, {{ username }} ({{ role }})</h5>
        <p class="text-muted small mb-0">Kelola proses akademik tugas akhir mahasiswa.</p>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-4 mb-3">
        <div class="card border-start border-4 border-warning shadow-sm h-100 py-2">
          <div class="card-body pb-2">
            <div class="text-warning fw-bold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">Berkas Menunggu Verifikasi</div>
            <div class="h6 mb-0 text-warning fw-bold">12</div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card border-start border-4 border-danger shadow-sm h-100 py-2">
          <div class="card-body pb-2">
            <div class="text-danger fw-bold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">Jadwal Belum Ditentukan</div>
            <div class="h6 mb-0 text-danger fw-bold">5</div>
          </div>
        </div>
      </div>
      <div class="col-md-4 mb-3">
        <div class="card border-start border-4 border-success shadow-sm h-100 py-2">
          <div class="card-body pb-2">
            <div class="text-success fw-bold text-uppercase" style="font-size: 0.75rem; letter-spacing: 0.5px;">Kegiatan Hari Ini</div>
            <div class="h6 mb-0 text-success fw-bold">3</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <div class="card shadow-sm">
          <div class="card-header py-3 bg-white border-bottom">
            <h6 class="m-0 fw-bold text-warning" style="font-size: 1rem;"><i class="fas fa-calendar-alt"></i> Pengelolaan Tugas Akhir</h6>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4 mb-3">
                <button class="btn btn-warning w-100">Verifikasi Berkas</button>
              </div>
              <div class="col-md-4 mb-3">
                <button class="btn btn-danger w-100">Atur Jadwal Seminar</button>
              </div>
              <div class="col-md-4 mb-3">
                <button class="btn btn-success w-100">Pantau Progress</button>
              </div>
            </div>
            <div class="mt-4">
              <h6>Jadwal Kegiatan Mendatang</h6>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Seminar Proposal - Ahmad Santoso
                  <span class="badge bg-warning text-dark">Besok, 10:00</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Sidang Skripsi - Siti Nurhaliza
                  <span class="badge bg-danger text-white">Lusa, 14:00</span>
                </li>
              </ul>
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
const role = ref('Staf Akademik')

const normalizeStoredValue = (value: string | null, fallback: string) => {
  if (!value) return fallback
  const trimmed = value.trim()
  if (trimmed === 'undefined' || trimmed === 'null' || trimmed === '') return fallback
  return trimmed
}

onMounted(() => {
  const storedName = normalizeStoredValue(sessionStorage.getItem('simtama-name'), '')
  username.value = storedName || normalizeStoredValue(sessionStorage.getItem('simtama-user'), 'Staf Akademik')

  const storedRole = normalizeStoredValue(sessionStorage.getItem('simtama-role'), 'staf').toLowerCase()
  if (storedRole === 'admin') role.value = 'Admin'
  else if (storedRole === 'staf') role.value = 'Staf Akademik'
})
</script>
