<template>
  <div class="container-fluid home-page-container">
    <div class="row">
      <div class="col-12">
        <h5 class="mb-3" style="color:#2e59a7;">Kelola Jadwal Sidang Skripsi</h5>
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="row align-items-start">
              <div class="col-lg-4 d-flex flex-column gap-3 mb-4">
                <div class="card border shadow-sm">
                  <div class="card-body p-3">
                    <h6 class="mb-3">Daftar Pengajuan Mahasiswa</h6>
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
                          <span class="badge" :class="statusBadge(student.status)">{{ student.status }}</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="card border shadow-sm h-100">
                  <div class="card-body p-3">
                    <h6 class="mb-3">Ketentuan Dokumen</h6>
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item">Draft Skripsi Final</li>
                      <li class="list-group-item">Surat Pengantar Sidang</li>
                      <li class="list-group-item">Pengesahan Pembimbing</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="col-lg-8">
                <div v-if="selectedStudent" class="card border shadow-sm">
                  <div class="card-body p-4">
                    <h6 class="mb-3">Detail Pengajuan {{ selectedStudent.name }}</h6>

                    <div class="mb-4">
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
                      <div class="row gx-2 gy-2">
                        <div class="col-6">
                          <div class="small text-muted">Judul Pengajuan</div>
                          <div>{{ selectedStudent.judul }}</div>
                        </div>
                        <div class="col-6">
                          <div class="small text-muted">Tanggal Pengajuan</div>
                          <div>{{ formatDisplayDate(selectedStudent.tanggal_pengajuan) }}</div>
                        </div>
                      </div>
                      <div class="row gx-2 gy-2 mt-3">
                        <div class="col-6">
                          <div class="small text-muted">Status Pengajuan</div>
                          <div><span class="badge" :class="statusBadge(selectedStudent.status)">{{ selectedStudent.status }}</span></div>
                        </div>
                        <div class="col-6">
                          <div class="small text-muted">Tanggal Jadwal</div>
                          <div>{{ selectedStudent.tanggal_jadwal ? formatDisplayDate(selectedStudent.tanggal_jadwal) : 'Belum dijadwalkan' }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="mb-4">
                      <h6 class="fw-semibold">Status Berkas</h6>
                      <div class="list-group list-group-flush">
                        <div
                          class="list-group-item px-0 py-3"
                          v-for="doc in selectedStudent.files"
                          :key="doc.label"
                        >
                          <div class="d-flex justify-content-between align-items-start">
                            <div>
                              <strong>{{ doc.label }}</strong>
                              <div class="small text-muted">{{ doc.fileName ? doc.fileName : 'Belum Unggah' }}</div>
                            </div>
                            <div class="text-end">
                              <span class="badge" :class="statusBadge(doc.status)">{{ doc.status }}</span>
                              <div v-if="doc.url" class="mt-2">
                                <a :href="fileLink(doc.url)" target="_blank" rel="noreferrer" class="btn btn-link btn-sm p-0">Lihat berkas</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="mb-4">
                      <h6 class="fw-semibold">Pesan dan Keputusan</h6>
                      <div class="mb-3">
                        <label class="form-label">Catatan Staf</label>
                        <textarea
                          class="form-control"
                          rows="3"
                          v-model="selectedStudent.catatan_staf"
                          placeholder="Tulis catatan atau instruksi untuk mahasiswa"
                        ></textarea>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Tanggal Jadwal</label>
                        <input type="datetime-local" class="form-control" v-model="selectedStudent.tanggal_jadwal" />
                      </div>
                      <div class="d-flex flex-wrap gap-2">
                        <button class="btn btn-primary" :disabled="saving" @click="saveSchedule">Simpan Jadwal</button>
                        <button class="btn btn-outline-primary" :disabled="saving" @click="approveSubmission">Terima</button>
                        <button class="btn btn-danger" :disabled="saving" @click="rejectSubmission">Tolak</button>
                        <button class="btn btn-outline-secondary" :disabled="loading" @click="loadSubmissions">Muat Ulang</button>
                      </div>
                      <div v-if="statusMessage" :class="['alert', statusClass, 'mt-3']">{{ statusMessage }}</div>
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
import { computed, onMounted, ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const submissions = ref<any[]>([])
const selectedStudent = ref<any>(null)
const loading = ref(false)
const saving = ref(false)
const statusMessage = ref('')
const statusClass = ref('alert-info')

const fileFields = [
  { field: 'berkas_proposal', label: 'Draft Skripsi Final', description: 'Naskah skripsi final mahasiswa' },
  { field: 'berkas_penilaian', label: 'Surat Pengantar Sidang', description: 'Surat pengantar sidang' },
  { field: 'berkas_pengantar', label: 'Pengesahan Pembimbing', description: 'Pengesahan pembimbing dari dosen pembimbing' }
]

const getFileName = (rawPath: string | null) => {
  if (!rawPath) return ''
  const normalized = rawPath.replace(/\\/g, '/')
  const match = normalized.match(/[^/]+$/)
  return match ? match[0] : normalized
}

const normalizeUploadPath = (rawPath: string | null) => {
  if (!rawPath) return ''
  let normalized = rawPath.replace(/\\/g, '/')
  const lower = normalized.toLowerCase()
  const uploadsIndex = lower.lastIndexOf('/uploads/')
  if (uploadsIndex >= 0) {
    normalized = normalized.slice(uploadsIndex + 1)
  }
  if (!normalized.startsWith('uploads/')) {
    normalized = `uploads/${normalized.replace(/^\/+/, '')}`
  }
  return normalized
}

const mapSubmission = (item: any) => {
  return {
    id: item.id,
    name: item.nama,
    program: item.prodi,
    judul: item.judul,
    status: item.status,
    catatan_staf: item.catatan_staf || '',
    tanggal_pengajuan: item.tanggal_pengajuan,
    tanggal_jadwal: formatToDateTimeInput(item.tanggal_jadwal),
    files: fileFields.map(field => {
      const url = normalizeUploadPath(item[field.field])
      return {
        field: field.field,
        label: field.label,
        description: field.description,
        url,
        fileName: url ? getFileName(url) : '',
        status: url ? 'Terunggah' : 'Belum Unggah'
      }
    })
  }
}

const formatToDateTimeInput = (timestamp: any) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const formatDisplayDate = (timestamp: any) => {
  if (!timestamp) return 'Belum disetujui'
  const date = new Date(timestamp)
  return date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}

const loadSubmissions = async () => {
  loading.value = true
  statusMessage.value = ''
  try {
    const response = await fetch(`${API_BASE}/api/staf/seminar?jenis=sidang-skripsi`)
    const data = await response.json()
    submissions.value = Array.isArray(data) ? data.map(mapSubmission) : []
    selectedStudent.value = submissions.value[0] || null
  } catch (error) {
    console.error(error)
    statusMessage.value = 'Gagal memuat data pengajuan sidang skripsi dari server.'
    statusClass.value = 'alert-danger'
  } finally {
    loading.value = false
  }
}

const selectStudent = (student: any) => {
  selectedStudent.value = student
  statusMessage.value = ''
  statusClass.value = 'alert-info'
}

const fileLink = (url: string) => {
  if (!url) return '#'
  const normalized = normalizeUploadPath(url)
  return `${API_BASE}/${normalized}`
}

const statusBadge = (status: string) => {
  if (status === 'Terverifikasi' || status === 'Terunggah') return 'bg-success'
  if (status === 'Menunggu' || status === 'Menunggu Verifikasi') return 'bg-warning text-dark'
  if (status === 'Ditolak') return 'bg-danger'
  if (status === 'Dijadwalkan') return 'bg-primary'
  return 'bg-secondary'
}

const formatForDatabase = (datetime: string) => datetime ? datetime.replace('T', ' ') : null

const updateSubmission = async (status: 'disetujui' | 'ditolak' | 'dijadwalkan') => {
  if (!selectedStudent.value) return
  if (status === 'dijadwalkan' && !selectedStudent.value.tanggal_jadwal) {
    statusMessage.value = 'Isi tanggal jadwal terlebih dahulu sebelum menyimpan jadwal.'
    statusClass.value = 'alert-warning'
    return
  }

  saving.value = true
  statusMessage.value = ''

  try {
    const payload: any = {
      status,
      catatan_staf: selectedStudent.value.catatan_staf || null
    }

    if (status === 'dijadwalkan') {
      payload.tanggal_jadwal = formatForDatabase(selectedStudent.value.tanggal_jadwal)
    }

    const response = await fetch(`${API_BASE}/api/staf/seminar/${selectedStudent.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await response.json()
    if (!response.ok) {
      statusMessage.value = result.message || 'Gagal memperbarui status pengajuan.'
      statusClass.value = 'alert-danger'
      return
    }

    statusMessage.value = result.message || 'Perubahan berhasil disimpan.'
    statusClass.value = 'alert-success'
    await loadSubmissions()
  } catch (error) {
    console.error(error)
    statusMessage.value = 'Terjadi kesalahan saat menyimpan perubahan.'
    statusClass.value = 'alert-danger'
  } finally {
    saving.value = false
  }
}

const rejectSubmission = () => updateSubmission('ditolak')
const approveSubmission = () => updateSubmission('disetujui')
const saveSchedule = () => updateSubmission('dijadwalkan')

onMounted(loadSubmissions)
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
