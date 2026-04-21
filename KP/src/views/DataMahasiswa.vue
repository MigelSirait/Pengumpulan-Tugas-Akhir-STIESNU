<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h5 class="mb-0">Data Mahasiswa</h5>
        <p class="text-muted mb-0">Kelola data mahasiswa yang terdaftar di sistem.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">Tambah Mahasiswa</button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>NIM</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Email</th>
                <th>Prodi</th>
                <th>Angkatan</th>
                <th class="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in students" :key="student.nim">
                <td>{{ student.nim }}</td>
                <td>{{ student.nama }}</td>
                <td>{{ student.username }}</td>
                <td>{{ student.email || '-' }}</td>
                <td>{{ student.prodi || '-' }}</td>
                <td>{{ student.angkatan || '-' }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary me-2" @click="openEdit(student)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteStudent(student.nim)">Hapus</button>
                </td>
              </tr>
              <tr v-if="students.length === 0">
                <td colspan="7" class="text-center text-muted">Belum ada data mahasiswa.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="modal fade" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ formMode === 'create' ? 'Tambah Mahasiswa' : 'Edit Mahasiswa' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">NIM</label>
                <input v-model="form.nim" type="text" class="form-control" :disabled="formMode === 'edit'" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Username</label>
                <input v-model="form.username" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Nama</label>
                <input v-model="form.nama" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Password</label>
                <input v-model="form.password" type="password" class="form-control" :placeholder="formMode === 'edit' ? 'Kosongkan jika tidak diubah' : ''" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Program Studi</label>
                <input v-model="form.prodi" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Angkatan</label>
                <input v-model="form.angkatan" type="text" class="form-control" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" @click="closeModal">Batal</button>
            <button class="btn btn-primary" type="button" @click="saveStudent">Simpan</button>
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
const students = ref<any[]>([])
const formMode = ref<'create' | 'edit'>('create')
const errorMessage = ref('')
const modalRef = ref<HTMLElement | null>(null)
let modalInstance: any = null

const form = reactive({
  nim: '',
  nama: '',
  username: '',
  password: '',
  email: '',
  prodi: '',
  angkatan: ''
})

const loadStudents = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/mahasiswa`)
    students.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

const resetForm = () => {
  form.nim = ''
  form.nama = ''
  form.username = ''
  form.password = ''
  form.email = ''
  form.prodi = ''
  form.angkatan = ''
  errorMessage.value = ''
}

const openCreate = () => {
  formMode.value = 'create'
  resetForm()
  modalInstance?.show()
}

const openEdit = (student: any) => {
  formMode.value = 'edit'
  form.nim = student.nim
  form.nama = student.nama
  form.username = student.username
  form.password = ''
  form.email = student.email || ''
  form.prodi = student.prodi || ''
  form.angkatan = student.angkatan || ''
  errorMessage.value = ''
  modalInstance?.show()
}

const closeModal = () => {
  modalInstance?.hide()
}

const saveStudent = async () => {
  try {
    const url = formMode.value === 'create'
      ? `${API_BASE}/api/mahasiswa`
      : `${API_BASE}/api/mahasiswa/${encodeURIComponent(form.nim)}`
    const method = formMode.value === 'create' ? 'POST' : 'PUT'
    const payload: any = {
      nama: form.nama,
      username: form.username,
      email: form.email || null,
      prodi: form.prodi || null,
      angkatan: form.angkatan || null
    }

    if (formMode.value === 'create') {
      payload.nim = form.nim
      payload.password = form.password
    } else if (form.password) {
      payload.password = form.password
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const result = await response.json()
    if (!response.ok) {
      errorMessage.value = result.message || 'Gagal menyimpan data mahasiswa'
      return
    }

    await loadStudents()
    closeModal()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Terjadi kesalahan saat menyimpan data mahasiswa'
  }
}

const deleteStudent = async (nim: string) => {
  if (!confirm('Hapus mahasiswa ini dari sistem?')) return
  try {
    const response = await fetch(`${API_BASE}/api/mahasiswa/${encodeURIComponent(nim)}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Gagal menghapus mahasiswa')
    await loadStudents()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  modalInstance = new Modal(modalRef.value!)
  await loadStudents()
})
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
}
</style>
