<template>
  <div class="container-fluid home-page-container">
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1" style="color:#2e59a7;">Penyimpanan Proposal</h5>
          <p class="text-muted mb-0">Kelola data proposal skripsi mahasiswa dan lihat file yang telah di-upload.</p>
        </div>
        <button class="btn btn-primary" @click="openCreate">Tambah Proposal</button>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>No</th>
                    <th>Mahasiswa</th>
                    <th>NIM</th>
                    <th>Program Studi</th>
                    <th>Judul Proposal</th>
                    <th>Berkas</th>
                    <th>Status</th>
                    <th>Tanggal Pengajuan</th>
                    <th class="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(task, index) in tasks" :key="task.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ task.nama }}</td>
                    <td>{{ task.mahasiswa_nim }}</td>
                    <td>{{ task.prodi }}</td>
                    <td>{{ task.judul }}</td>
                    <td>
                      <a v-if="task.file_path" :href="fileLink(task.file_path)" target="_blank" rel="noreferrer" class="btn btn-sm btn-outline-secondary">
                        Lihat File
                      </a>
                      <span v-else class="text-muted">Tidak ada file</span>
                    </td>
                    <td>{{ task.status }}</td>
                    <td>{{ task.tanggal_pengajuan ? new Date(task.tanggal_pengajuan).toLocaleDateString() : '-' }}</td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-outline-primary me-2" @click="openEdit(task)">Edit</button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteTask(task.id)">Hapus</button>
                    </td>
                  </tr>
                  <tr v-if="tasks.length === 0">
                    <td colspan="9" class="text-center text-muted">Belum ada data proposal.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ formMode === 'create' ? 'Tambah Proposal' : 'Edit Proposal' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Mahasiswa</label>
                <select v-model="form.mahasiswa_nim" class="form-select">
                  <option value="">Pilih mahasiswa</option>
                  <option v-for="student in students" :key="student.nim" :value="student.nim">
                    {{ student.nama }} ({{ student.nim }})
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Jenis</label>
                <input class="form-control" type="text" value="proposal" disabled />
              </div>
              <div class="col-12">
                <label class="form-label">Judul Proposal</label>
                <input v-model="form.judul" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Status</label>
                <select v-model="form.status" class="form-select">
                  <option value="menunggu">Menunggu</option>
                  <option value="disetujui">Disetujui</option>
                  <option value="dikembalikan">Dikembalikan</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Tanggal Approval</label>
                <input v-model="form.tanggal_approval" type="date" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label">Catatan</label>
                <textarea v-model="form.catatan" class="form-control" rows="3"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" @click="closeModal">Batal</button>
            <button class="btn btn-primary" type="button" @click="saveTask">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Modal } from 'bootstrap'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const tasks = ref<any[]>([])
const students = ref<any[]>([])
const formMode = ref<'create' | 'edit'>('create')
const errorMessage = ref('')
const modalRef = ref<HTMLElement | null>(null)
let modalInstance: any = null

const form = reactive({
  id: '',
  mahasiswa_nim: '',
  jenis: 'proposal',
  judul: '',
  status: 'menunggu',
  catatan: '',
  tanggal_approval: ''
})

const loadTasks = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/tugas-akhir?jenis=proposal`)
    tasks.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

const loadStudents = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/mahasiswa`)
    students.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

const fileLink = (filePath: string) => {
  if (!filePath) return '#'
  return `${API_BASE}/${filePath.replace(/\\/g, '/')}`
}

const resetForm = () => {
  form.id = ''
  form.mahasiswa_nim = ''
  form.jenis = 'proposal'
  form.judul = ''
  form.status = 'menunggu'
  form.catatan = ''
  form.tanggal_approval = ''
  errorMessage.value = ''
}

const openEdit = (task: any) => {
  formMode.value = 'edit'
  form.id = task.id
  form.mahasiswa_nim = task.mahasiswa_nim
  form.jenis = 'proposal'
  form.judul = task.judul
  form.status = task.status
  form.catatan = task.catatan || ''
  form.tanggal_approval = task.tanggal_approval ? task.tanggal_approval.split('T')[0] : ''
  errorMessage.value = ''
  modalInstance?.show()
}

const closeModal = () => {
  modalInstance?.hide()
}

const saveTask = async () => {
  try {
    const url = formMode.value === 'create'
      ? `${API_BASE}/api/admin/tugas-akhir`
      : `${API_BASE}/api/admin/tugas-akhir/${encodeURIComponent(form.id)}`
    const method = formMode.value === 'create' ? 'POST' : 'PUT'
    const payload: any = {
      mahasiswa_nim: form.mahasiswa_nim,
      jenis: 'proposal',
      judul: form.judul,
      status: form.status,
      catatan: form.catatan || null,
      tanggal_approval: form.tanggal_approval || null
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const result = await response.json()
    if (!response.ok) {
      errorMessage.value = result.message || 'Gagal menyimpan data proposal'
      return
    }
    await loadTasks()
    closeModal()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Terjadi kesalahan saat menyimpan data proposal'
  }
}

const deleteTask = async (id: number) => {
  if (!confirm('Hapus data proposal ini?')) return
  try {
    const response = await fetch(`${API_BASE}/api/admin/tugas-akhir/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Gagal menghapus proposal')
    await loadTasks()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  modalInstance = new Modal(modalRef.value!)
  await Promise.all([loadStudents(), loadTasks()])
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

.table {
  margin-bottom: 0;
}
</style>
