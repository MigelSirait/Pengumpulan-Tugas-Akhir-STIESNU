<template>
  <div class="container-fluid home-page-container">
    <div class="row">
      <div class="col-12">
        <h5 class="mb-3" style="color:#2e59a7;">{{ pageTitle }}</h5>
        <div class="card shadow-sm">
          <div class="card-body">
            <!-- Outline Tab -->
            <div v-if="currentPage === 'outline'">
              <h6 class="mb-3">Outline Skripsi</h6>
              <p class="text-muted">Status: <span class="badge bg-secondary">Belum Dikirim</span></p>
              <p class="mt-3">Unggah file outline Anda agar dapat ditinjau oleh admin dan staf.</p>
              <div class="mb-4">
                <label class="form-label">Judul Outline</label>
                <input v-model="taskUploads.outline.title" type="text" class="form-control" placeholder="Masukkan judul outline" />
              </div>
              <div class="mb-3">
                <label class="form-label">File Outline</label>
                <div class="input-group">
                  <input type="file" class="form-control" @change="event => handleTaskFileChange('outline', event)" accept=".pdf,.doc,.docx" />
                </div>
                <div class="small text-muted mt-2">{{ taskUploads.outline.fileName || 'Belum ada file. Upload file PDF/DOC/DOCX.' }}</div>
              </div>
              <div v-if="taskUploads.outline.message" :class="['alert', taskUploads.outline.messageClass]">{{ taskUploads.outline.message }}</div>
              <div class="mt-3 text-end">
                <button class="btn btn-success" :disabled="taskSubmitting" @click="submitTaskUpload('outline')">Kirim Outline</button>
              </div>
            </div>

            <!-- Pengumpulan Proposal Tab -->
            <div v-else-if="currentPage === 'pengajuan-proposal'">
              <h6 class="mb-3">Pengumpulan Proposal</h6>
              <p class="text-muted">Status: <span class="badge bg-secondary">Belum Dikirim</span></p>
              <p class="mt-3">Unggah proposal Anda agar admin dan staf dapat meninjau dokumen.</p>
              <div class="mb-4">
                <label class="form-label">Judul Proposal</label>
                <input v-model="taskUploads.proposal.title" type="text" class="form-control" placeholder="Masukkan judul proposal" />
              </div>
              <div class="mb-3">
                <label class="form-label">File Proposal</label>
                <div class="input-group">
                  <input type="file" class="form-control" @change="event => handleTaskFileChange('proposal', event)" accept=".pdf,.doc,.docx" />
                </div>
                <div class="small text-muted mt-2">{{ taskUploads.proposal.fileName || 'Belum ada file. Upload file PDF/DOC/DOCX.' }}</div>
              </div>
              <div v-if="taskUploads.proposal.message" :class="['alert', taskUploads.proposal.messageClass]">{{ taskUploads.proposal.message }}</div>
              <div class="mt-3 text-end">
                <button class="btn btn-success" :disabled="taskSubmitting" @click="submitTaskUpload('proposal')">Kirim Proposal</button>
              </div>
            </div>

            <!-- Seminar Proposal Tab -->
            <div v-else-if="currentPage === 'seminar-proposal'">
              <h6 class="mb-3">Seminar Proposal</h6>
              <p class="text-muted">Status: <span class="badge bg-secondary">Belum Dijadwalkan</span></p>
              <p class="mt-3">Unggah berkas seminar proposal Anda untuk diajukan ke staf akademik.</p>
              <div class="mb-4">
                <label class="form-label">Judul Pengajuan</label>
                <input v-model="submissionTitle" type="text" class="form-control" placeholder="Masukkan judul pengajuan" />
              </div>
              <div v-if="statusMessage" :class="['alert', statusClass]">{{ statusMessage }}</div>
              <div class="mt-4">
                <div class="list-group">
                  <div
                    class="list-group-item d-flex align-items-center justify-content-between"
                    v-for="(doc, index) in uploadDocs['seminar-proposal']"
                    :key="doc.label"
                  >
                    <div>
                      <strong>{{ doc.label }}</strong>
                      <div class="small text-muted">Status: {{ doc.status }}</div>
                    </div>
                    <div class="text-end">
                      <label class="btn btn-outline-primary btn-sm mb-0">
                        Pilih Berkas
                        <input type="file" class="d-none" @change="event => handleFileChange('seminar-proposal', index, event)" accept=".pdf,.doc,.docx" />
                      </label>
                      <div class="small mt-1 text-break">{{ doc.fileName || 'Belum ada file' }}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 text-end">
                  <button class="btn btn-success" :disabled="!allFilesSelected('seminar-proposal')" @click="submitToStaff('seminar-proposal')">
                    Ajukan ke Staf
                  </button>
                </div>
              </div>
            </div>

            <!-- Pengumpulan Skripsi Tab -->
            <div v-else-if="currentPage === 'pengajuan-skripsi'">
              <h6 class="mb-3">Pengumpulan Skripsi</h6>
              <p class="text-muted">Status: <span class="badge bg-secondary">Belum Dikirim</span></p>
              <p class="mt-3">Unggah skripsi final Anda agar admin dan staf dapat melakukan evaluasi akhir.</p>
              <div class="mb-4">
                <label class="form-label">Judul Skripsi</label>
                <input v-model="taskUploads.skripsi.title" type="text" class="form-control" placeholder="Masukkan judul skripsi" />
              </div>
              <div class="mb-3">
                <label class="form-label">File Skripsi</label>
                <div class="input-group">
                  <input type="file" class="form-control" @change="event => handleTaskFileChange('skripsi', event)" accept=".pdf,.doc,.docx" />
                </div>
                <div class="small text-muted mt-2">{{ taskUploads.skripsi.fileName || 'Belum ada file. Upload file PDF/DOC/DOCX.' }}</div>
              </div>
              <div v-if="taskUploads.skripsi.message" :class="['alert', taskUploads.skripsi.messageClass]">{{ taskUploads.skripsi.message }}</div>
              <div class="mt-3 text-end">
                <button class="btn btn-success" :disabled="taskSubmitting" @click="submitTaskUpload('skripsi')">Kirim Skripsi</button>
              </div>
            </div>

            <!-- Seminar Hasil Tab -->
            <div v-else-if="currentPage === 'seminar-hasil'">
              <h6 class="mb-3">Seminar Hasil</h6>
              <p class="text-muted">Status: <span class="badge bg-secondary">Belum Dijadwalkan</span></p>
              <p class="mt-3">Unggah dokumen seminar hasil Anda untuk proses penjadwalan dan pengajuan ke staf akademik.</p>
              <div class="mb-4">
                <label class="form-label">Judul Pengajuan</label>
                <input v-model="submissionTitle" type="text" class="form-control" placeholder="Masukkan judul pengajuan" />
              </div>
              <div v-if="statusMessage" :class="['alert', statusClass]">{{ statusMessage }}</div>
              <div class="mt-4">
                <div class="list-group">
                  <div
                    class="list-group-item d-flex align-items-center justify-content-between"
                    v-for="(doc, index) in uploadDocs['seminar-hasil']"
                    :key="doc.label"
                  >
                    <div>
                      <strong>{{ doc.label }}</strong>
                      <div class="small text-muted">Status: {{ doc.status }}</div>
                    </div>
                    <div class="text-end">
                      <label class="btn btn-outline-primary btn-sm mb-0">
                        Pilih Berkas
                        <input type="file" class="d-none" @change="event => handleFileChange('seminar-hasil', index, event)" accept=".pdf,.doc,.docx" />
                      </label>
                      <div class="small mt-1 text-break">{{ doc.fileName || 'Belum ada file' }}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 text-end">
                  <button class="btn btn-success" :disabled="!allFilesSelected('seminar-hasil')" @click="submitToStaff('seminar-hasil')">
                    Ajukan ke Staf
                  </button>
                </div>
              </div>
            </div>

            <!-- Sidang Skripsi Tab -->
            <div v-else-if="currentPage === 'sidang-skripsi'">
              <h6 class="mb-3">Sidang Skripsi</h6>
              <p class="text-muted">Status: <span class="badge bg-secondary">Belum Dijadwalkan</span></p>
              <p class="mt-3">Unggah berkas pendukung sidang skripsi agar staf dapat memproses pengajuan dan penjadwalan.</p>
              <div class="mb-4">
                <label class="form-label">Judul Pengajuan</label>
                <input v-model="submissionTitle" type="text" class="form-control" placeholder="Masukkan judul pengajuan" />
              </div>
              <div v-if="statusMessage" :class="['alert', statusClass]">{{ statusMessage }}</div>
              <div class="mt-4">
                <div class="list-group">
                  <div
                    class="list-group-item d-flex align-items-center justify-content-between"
                    v-for="(doc, index) in uploadDocs['sidang-skripsi']"
                    :key="doc.label"
                  >
                    <div>
                      <strong>{{ doc.label }}</strong>
                      <div class="small text-muted">Status: {{ doc.status }}</div>
                    </div>
                    <div class="text-end">
                      <label class="btn btn-outline-primary btn-sm mb-0">
                        Pilih Berkas
                        <input type="file" class="d-none" @change="event => handleFileChange('sidang-skripsi', index, event)" accept=".pdf,.doc,.docx" />
                      </label>
                      <div class="small mt-1 text-break">{{ doc.fileName || 'Belum ada file' }}</div>
                    </div>
                  </div>
                </div>

                <div class="mt-4 text-end">
                  <button class="btn btn-success" :disabled="!allFilesSelected('sidang-skripsi')" @click="submitToStaff('sidang-skripsi')">
                    Ajukan ke Staf
                  </button>
                </div>
              </div>
            </div>

            <!-- Default/Home Tab -->
            <div v-else>
              <p>Silakan pilih salah satu menu di sidebar untuk melihat detail.</p>
              <ul class="mt-3">
                <li><router-link to="/tugas-akhir/outline">Outline</router-link></li>
                <li><router-link to="/tugas-akhir/pengajuan-proposal">Pengumpulan Proposal</router-link></li>
                <li><router-link to="/tugas-akhir/seminar-proposal">Seminar Proposal</router-link></li>
                <li><router-link to="/tugas-akhir/pengajuan-skripsi">Pengumpulan Skripsi</router-link></li>
                <li><router-link to="/tugas-akhir/seminar-hasil">Seminar Hasil</router-link></li>
                <li><router-link to="/tugas-akhir/sidang-skripsi">Sidang Skripsi</router-link></li>
              </ul>
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

const route = useRoute()
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type SeminarSection = 'seminar-proposal' | 'seminar-hasil' | 'sidang-skripsi'

type UploadDoc = {
  field: string
  label: string
  fileName: string
  status: string
  file: File | null
}

type TaskSection = 'outline' | 'proposal' | 'skripsi'

type TaskUpload = {
  file: File | null
  fileName: string
  status: string
  title: string
  message: string
  messageClass: string
}

const uploadDocs = reactive<Record<SeminarSection, UploadDoc[]>>({
  'seminar-proposal': [
    { field: 'berkas_proposal', label: 'Draft Proposal', fileName: '', status: 'Belum Unggah', file: null },
    { field: 'berkas_penilaian', label: 'Form Penilaian Dosen', fileName: '', status: 'Belum Unggah', file: null },
    { field: 'berkas_pengantar', label: 'Surat Pengantar', fileName: '', status: 'Belum Unggah', file: null }
  ],
  'seminar-hasil': [
    { field: 'berkas_proposal', label: 'Draft Seminar Hasil', fileName: '', status: 'Belum Unggah', file: null },
    { field: 'berkas_penilaian', label: 'Absensi Seminar', fileName: '', status: 'Belum Unggah', file: null },
    { field: 'berkas_pengantar', label: 'Berita Acara Seminar', fileName: '', status: 'Belum Unggah', file: null }
  ],
  'sidang-skripsi': [
    { field: 'berkas_proposal', label: 'Draft Skripsi Final', fileName: '', status: 'Belum Unggah', file: null },
    { field: 'berkas_penilaian', label: 'Surat Pengantar Sidang', fileName: '', status: 'Belum Unggah', file: null },
    { field: 'berkas_pengantar', label: 'Pengesahan Pembimbing', fileName: '', status: 'Belum Unggah', file: null }
  ]
})

const taskUploads = reactive<Record<TaskSection, TaskUpload>>({
  outline: { file: null, fileName: '', status: 'Belum Unggah', title: '', message: '', messageClass: 'alert-info' },
  proposal: { file: null, fileName: '', status: 'Belum Unggah', title: '', message: '', messageClass: 'alert-info' },
  skripsi: { file: null, fileName: '', status: 'Belum Unggah', title: '', message: '', messageClass: 'alert-info' }
})

const taskSubmitting = ref(false)

const pageTitle = computed(() => {
  switch(route.name) {
    case 'TugasAkhirOutline': return 'Outline Skripsi'
    case 'TugasAkhirProposal': return 'Pengumpulan Proposal'
    case 'TugasAkhirSeminarProposal': return 'Seminar Proposal'
    case 'TugasAkhirSkripsi': return 'Pengumpulan Skripsi'
    case 'TugasAkhirSeminarHasil': return 'Seminar Hasil'
    case 'TugasAkhirSidang': return 'Sidang Skripsi'
    default: return 'Tugas Akhir'
  }
})

const currentPage = computed(() => {
  const path = route.path.split('/').pop()
  return path === 'tugas-akhir' ? '' : path
})

const sectionMeta: Record<SeminarSection, { type: string; description: string }> = {
  'seminar-proposal': {
    type: 'seminar-proposal',
    description: 'Unggah berkas seminar proposal Anda untuk diajukan ke staf akademik.'
  },
  'seminar-hasil': {
    type: 'seminar-hasil',
    description: 'Unggah dokumen seminar hasil Anda untuk proses penjadwalan dan pengajuan ke staf akademik.'
  },
  'sidang-skripsi': {
    type: 'sidang-skripsi',
    description: 'Unggah berkas pendukung sidang skripsi agar staf dapat memproses pengajuan dan penjadwalan.'
  }
}

const submissionTitle = ref('')
const submitting = ref(false)
const statusMessage = ref('')
const statusClass = ref('alert-info')

const handleFileChange = (section: SeminarSection, index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  const sectionDocs = uploadDocs[section]
  if (file && sectionDocs?.[index]) {
    sectionDocs[index].file = file
    sectionDocs[index].fileName = file.name
    sectionDocs[index].status = 'Tervalidasi'
  }
}

const allFilesSelected = (section: SeminarSection) => {
  const sectionDocs = uploadDocs[section] || []
  return sectionDocs.every((doc: UploadDoc) => !!doc.file)
}

const getCurrentStudentNim = async () => {
  const storedUsername = sessionStorage.getItem('simtama-username') || sessionStorage.getItem('simtama-user')
  if (!storedUsername) return null
  try {
    const response = await fetch(`${API_BASE}/api/users/${encodeURIComponent(storedUsername)}`)
    if (!response.ok) return null
    const data = await response.json()
    return data.user?.id || null
  } catch (error) {
    console.error('Gagal mengambil NIM mahasiswa:', error)
    return null
  }
}

const submitToStaff = async (section: SeminarSection) => {
  statusMessage.value = ''
  statusClass.value = 'alert-info'

  if (!submissionTitle.value.trim()) {
    statusMessage.value = 'Judul pengajuan harus diisi.'
    statusClass.value = 'alert-warning'
    return
  }

  const sectionDocs = uploadDocs[section] || []
  if (!allFilesSelected(section)) {
    statusMessage.value = 'Semua berkas harus dipilih sebelum dikirim.'
    statusClass.value = 'alert-warning'
    return
  }

  const nim = await getCurrentStudentNim()
  if (!nim) {
    statusMessage.value = 'Tidak dapat menemukan data mahasiswa. Silakan login ulang.'
    statusClass.value = 'alert-danger'
    return
  }

  const formData = new FormData()
  formData.append('nim', nim)
  formData.append('jenis', sectionMeta[section].type)
  formData.append('judul', submissionTitle.value.trim())

  const fileProposal = sectionDocs[0]?.file
  const filePenilaian = sectionDocs[1]?.file
  const filePengantar = sectionDocs[2]?.file

  if (!fileProposal || !filePenilaian || !filePengantar) {
    statusMessage.value = 'Semua berkas harus terisi sebelum mengirim.'
    statusClass.value = 'alert-warning'
    submitting.value = false
    return
  }

  formData.append('berkas_proposal', fileProposal)
  formData.append('berkas_penilaian', filePenilaian)
  formData.append('berkas_pengantar', filePengantar)

  submitting.value = true
  try {
    const response = await fetch(`${API_BASE}/api/seminar`, {
      method: 'POST',
      body: formData
    })
    const result = await response.json()

    if (!response.ok) {
      statusMessage.value = result.message || 'Gagal mengirim pengajuan.'
      statusClass.value = 'alert-danger'
      return
    }

    statusMessage.value = result.message || 'Pengajuan berhasil dikirim.'
    statusClass.value = 'alert-success'
    sectionDocs.forEach(doc => {
      if (doc.file) doc.status = 'Menunggu Verifikasi'
    })
  } catch (error) {
    console.error('Gagal mengirim pengajuan:', error)
    statusMessage.value = 'Terjadi kesalahan server saat mengirim pengajuan.'
    statusClass.value = 'alert-danger'
  } finally {
    submitting.value = false
  }
}

const handleTaskFileChange = (section: TaskSection, event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    taskUploads[section].file = file
    taskUploads[section].fileName = file.name
    taskUploads[section].status = 'Tervalidasi'
  }
}

const submitTaskUpload = async (section: TaskSection) => {
  const upload = taskUploads[section]
  upload.message = ''
  upload.messageClass = 'alert-info'

  if (!upload.title.trim()) {
    upload.message = 'Judul harus diisi.'
    upload.messageClass = 'alert-warning'
    return
  }

  if (!upload.file) {
    upload.message = 'Pilih file terlebih dahulu.'
    upload.messageClass = 'alert-warning'
    return
  }

  const nim = await getCurrentStudentNim()
  if (!nim) {
    upload.message = 'Tidak dapat menemukan data mahasiswa. Silakan login ulang.'
    upload.messageClass = 'alert-danger'
    return
  }

  const formData = new FormData()
  formData.append('nim', nim)
  formData.append('jenis', section)
  formData.append('judul', upload.title.trim())
  formData.append('file', upload.file)

  taskSubmitting.value = true
  try {
    const response = await fetch(`${API_BASE}/api/tugas-akhir`, {
      method: 'POST',
      body: formData
    })
    const result = await response.json()

    if (!response.ok) {
      upload.message = result.message || 'Gagal mengunggah tugas akhir.'
      upload.messageClass = 'alert-danger'
      return
    }

    upload.message = result.message || 'Pengajuan berhasil dikirim.'
    upload.messageClass = 'alert-success'
    upload.status = 'Menunggu Verifikasi'
  } catch (error) {
    console.error('Gagal mengunggah tugas akhir:', error)
    upload.message = 'Terjadi kesalahan server saat mengunggah.'
    upload.messageClass = 'alert-danger'
  } finally {
    taskSubmitting.value = false
  }
}
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

a {
  color: #2e59a7;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(46, 89, 167, 0.2);
}
</style>