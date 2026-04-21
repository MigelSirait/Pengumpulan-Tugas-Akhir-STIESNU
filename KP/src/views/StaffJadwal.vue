<template>
  <div class="container-fluid home-page-container">
    <div class="row">
      <div class="col-12">
        <h5 class="mb-3" style="color:#2e59a7;">{{ pageTitle }}</h5>
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-4 mb-4">
                <div class="card border shadow-sm">
                  <div class="card-body p-3">
                    <h6 class="mb-3">Daftar Pengajuan</h6>
                    <div class="list-group">
                      <button
                        v-for="student in submissions"
                        :key="student.id"
                        type="button"
                        class="list-group-item list-group-item-action"
                        :class="{ active: selectedStudent && selectedStudent.id === student.id }"
                        @click="selectStudent(student)"
                      >
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{{ student.name }}</strong>
                            <div class="small text-muted">{{ student.program }} - {{ student.status }}</div>
                          </div>
                          <span
                            class="badge"
                            :class="student.status === 'Terverifikasi' ? 'bg-success' : student.status === 'Menunggu Verifikasi' ? 'bg-warning text-dark' : 'bg-secondary'"
                          >
                            {{ student.status }}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-lg-8">
                <div v-if="selectedStudent" class="card border shadow-sm">
                  <div class="card-body p-4">
                    <h6 class="mb-3">Detail Pengajuan Mahasiswa</h6>
                    <div class="mb-3">
                      <div class="row gx-2 gy-2">
                        <div class="col-6">
                          <div class="small text-muted">Nama</div>
                          <div>{{ selectedStudent.name }}</div>
                        </div>
                        <div class="col-6">
                          <div class="small text-muted">Program</div>
                          <div>{{ selectedStudent.program }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="mb-4">
                      <h6 class="fw-semibold">Berkas Pengajuan</h6>
                      <div class="list-group list-group-flush">
                        <div
                          class="list-group-item px-0 py-3"
                          v-for="doc in selectedStudent.files"
                          :key="doc.label"
                        >
                          <div class="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>{{ doc.label }}</strong>
                              <div class="small text-muted">{{ doc.fileName || 'Belum ada file' }}</div>
                            </div>
                            <div class="text-end">
                              <span
                                class="badge"
                                :class="doc.status === 'Terverifikasi' ? 'bg-success' : doc.status === 'Menunggu Verifikasi' ? 'bg-warning text-dark' : 'bg-secondary'"
                              >
                                {{ doc.status }}
                              </span>
                              <div v-if="doc.fileName && doc.fileName !== 'Belum Unggah'" class="mt-2">
                                <a :href="fileLink(doc.fileName)" target="_blank" rel="noreferrer" class="btn btn-link btn-sm p-0">Lihat berkas</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="mb-4">
                      <h6 class="fw-semibold">Jadwal & Ruangan</h6>
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">Tanggal</label>
                          <input type="date" class="form-control" v-model="selectedStudent.schedule.date" />
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Jam</label>
                          <input type="time" class="form-control" v-model="selectedStudent.schedule.time" />
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Ruangan</label>
                          <input type="text" class="form-control" v-model="selectedStudent.schedule.room" placeholder="Contoh: A-101" />
                        </div>
                        <div class="col-md-6">
                          <label class="form-label">Ketua Penguji</label>
                          <input type="text" class="form-control" v-model="selectedStudent.schedule.panel" placeholder="Contoh: Dr. Budi" />
                        </div>
                        <div class="col-12">
                          <label class="form-label">Catatan</label>
                          <textarea class="form-control" rows="3" v-model="selectedStudent.schedule.note" placeholder="Catatan tambahan untuk mahasiswa atau ruangan"></textarea>
                        </div>
                      </div>
                    </div>

                    <div class="mb-4">
                      <h6 class="fw-semibold">Tindakan</h6>
                      <div class="mb-3">
                        <label class="form-label">Pesan ke Mahasiswa</label>
                        <textarea
                          class="form-control"
                          rows="3"
                          v-model="selectedStudent.rejectionMessage"
                          placeholder="Tulis alasan penolakan jika berkas kurang lengkap atau salah"
                        ></textarea>
                      </div>
                      <div class="d-flex flex-wrap gap-2">
                        <button
                          class="btn btn-danger"
                          :disabled="!hasIncompleteFiles"
                          @click="rejectSubmission"
                        >
                          Tolak Berkas
                        </button>
                        <button class="btn btn-outline-secondary" @click="clearSchedule">Reset</button>
                        <button class="btn btn-primary" @click="saveSchedule">Simpan Jadwal</button>
                      </div>
                    </div>

                    <div v-if="selectedStudent.rejected" class="alert alert-warning mt-4 mb-0">
                      Berkas ditolak dan pesan telah dikirim ke mahasiswa.
                      <div class="small mt-2"><strong>Pesan:</strong> {{ selectedStudent.rejectionMessage || 'Tidak ada pesan' }}</div>
                    </div>
                    <div v-else-if="selectedStudent.schedule.saved" class="alert alert-success mt-4 mb-0">
                      Jadwal tersimpan untuk <strong>{{ selectedStudent.name }}</strong> pada <strong>{{ formattedSchedule }}</strong>.
                    </div>
                  </div>
                </div>
                <div v-else class="card border shadow-sm p-4 text-center text-muted">
                  <p class="mb-0">Pilih mahasiswa di panel kiri untuk melihat berkas pengajuan dan melakukan penjadwalan.</p>
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
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const route = useRoute()

const pageTitle = computed(() => {
  switch (route.name) {
    case 'StaffJadwalSeminarProposal':
      return 'Kelola Jadwal Seminar Proposal'
    case 'StaffJadwalSeminarHasil':
      return 'Kelola Jadwal Seminar Hasil'
    case 'StaffJadwalSidang':
      return 'Kelola Jadwal Sidang Skripsi'
    default:
      return 'Kelola Jadwal'
  }
})

const submissions = reactive([
  {
    id: 1,
    name: 'Ahmad Santoso',
    program: 'Teknik Informatika',
    status: 'Menunggu Verifikasi',
    rejected: false,
    rejectionMessage: '',
    files: [
      { label: 'Draft Proposal', fileName: 'proposal_ahmad.pdf', status: 'Menunggu Verifikasi' },
      { label: 'Form Penilaian Dosen', fileName: 'form_penilaian_ahmad.pdf', status: 'Terverifikasi' },
      { label: 'Surat Pengantar', fileName: 'surat_pengantar_ahmad.pdf', status: 'Terverifikasi' }
    ],
    schedule: { date: '', time: '', room: '', panel: '', note: '', saved: false }
  },
  {
    id: 2,
    name: 'Siti Nurhaliza',
    program: 'Manajemen',
    status: 'Menunggu Verifikasi',
    files: [
      { label: 'Draft Proposal', fileName: 'proposal_siti.pdf', status: 'Menunggu Verifikasi' },
      { label: 'Form Penilaian Dosen', fileName: 'form_penilaian_siti.pdf', status: 'Menunggu Verifikasi' },
      { label: 'Surat Pengantar', fileName: 'surat_pengantar_siti.pdf', status: 'Belum Unggah' }
    ],
    schedule: { date: '', time: '', room: '', panel: '', note: '', saved: false }
  },
  {
    id: 3,
    name: 'Budi Wijaya',
    program: 'Akuntansi',
    status: 'Dijadwalkan',
    rejected: false,
    rejectionMessage: '',
    files: [
      { label: 'Draft Proposal', fileName: 'proposal_budi.pdf', status: 'Terverifikasi' },
      { label: 'Form Penilaian Dosen', fileName: 'form_penilaian_budi.pdf', status: 'Terverifikasi' },
      { label: 'Surat Pengantar', fileName: 'surat_pengantar_budi.pdf', status: 'Terverifikasi' }
    ],
    schedule: { date: '2026-04-20', time: '09:00', room: 'A-101', panel: 'Dr. Sulastri', note: 'Persiapkan presentasi 15 menit', saved: true }
  }
])

const selectedStudent = ref(submissions[0])

const hasIncompleteFiles = computed(() => {
  return selectedStudent.value?.files.some((doc: any) => doc.status !== 'Terverifikasi') ?? false
})

const selectStudent = (student: any) => {
  selectedStudent.value = student
}

const clearSchedule = () => {
  if (!selectedStudent.value) return
  selectedStudent.value.schedule = { date: '', time: '', room: '', panel: '', note: '', saved: false }
  selectedStudent.value.rejected = false
  selectedStudent.value.rejectionMessage = ''
}

const fileLink = (fileName: string) => {
  if (!fileName || fileName === 'Belum Unggah') return '#'
  return `${API_BASE}/uploads/${encodeURIComponent(fileName)}`
}

const saveSchedule = () => {
  if (!selectedStudent.value) return
  selectedStudent.value.status = 'Dijadwalkan'
  selectedStudent.value.rejected = false
  selectedStudent.value.schedule.saved = true
}

const rejectSubmission = () => {
  if (!selectedStudent.value) return
  selectedStudent.value.status = 'Ditolak'
  selectedStudent.value.rejected = true
  selectedStudent.value.schedule.saved = false
  selectedStudent.value.files.forEach((doc: any) => {
    if (doc.status !== 'Terverifikasi') doc.status = 'Perbaiki'
  })
}

const formattedSchedule = computed(() => {
  const schedule = selectedStudent.value?.schedule
  if (!schedule || !schedule.date || !schedule.time || !schedule.room) return 'belum lengkap'
  return `${schedule.date} ${schedule.time} di ${schedule.room}`
})
</script>

<style scoped>
.home-page-container {
  padding: 1.25rem;
}

.card {
  border: none;
  border-radius: 0.35rem;
}

.card-body {
  padding: 1.5rem;
}

.list-group-item.active {
  background-color: #2e59a7;
  border-color: #2e59a7;
  color: #fff;
}

button {
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}
</style>
