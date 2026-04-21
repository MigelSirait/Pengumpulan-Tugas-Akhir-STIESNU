<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h5 class="mb-0">Data Staf</h5>
        <p class="text-muted mb-0">Kelola staf akademik yang terdaftar di sistem.</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">Tambah Staf</button>
    </div>

    <div class="card shadow-sm">
      <div class="card-body p-3">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Email</th>
                <th>Jabatan</th>
                <th class="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="staff in staffs" :key="staff.id">
                <td>{{ staff.id }}</td>
                <td>{{ staff.nama }}</td>
                <td>{{ staff.username }}</td>
                <td>{{ staff.email || '-' }}</td>
                <td>{{ staff.jabatan || '-' }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-outline-primary me-2" @click="openEdit(staff)">Edit</button>
                  <button class="btn btn-sm btn-outline-danger" @click="deleteStaff(staff.id)">Hapus</button>
                </td>
              </tr>
              <tr v-if="staffs.length === 0">
                <td colspan="6" class="text-center text-muted">Belum ada data staf.</td>
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
            <h5 class="modal-title">{{ formMode === 'create' ? 'Tambah Staf' : 'Edit Staf' }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nama</label>
                <input v-model="form.nama" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Username</label>
                <input v-model="form.username" type="text" class="form-control" />
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
                <label class="form-label">Jabatan</label>
                <input v-model="form.jabatan" type="text" class="form-control" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" @click="closeModal">Batal</button>
            <button class="btn btn-primary" type="button" @click="saveStaff">Simpan</button>
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
const staffs = ref<any[]>([])
const formMode = ref<'create' | 'edit'>('create')
const errorMessage = ref('')
const modalRef = ref<HTMLElement | null>(null)
let modalInstance: any = null

const form = reactive({
  id: '',
  nama: '',
  username: '',
  password: '',
  email: '',
  jabatan: ''
})

const loadStaffs = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/staf`)
    staffs.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

const resetForm = () => {
  form.id = ''
  form.nama = ''
  form.username = ''
  form.password = ''
  form.email = ''
  form.jabatan = ''
  errorMessage.value = ''
}

const openCreate = () => {
  formMode.value = 'create'
  resetForm()
  modalInstance?.show()
}

const openEdit = (staff: any) => {
  formMode.value = 'edit'
  form.id = staff.id
  form.nama = staff.nama
  form.username = staff.username
  form.password = ''
  form.email = staff.email || ''
  form.jabatan = staff.jabatan || ''
  errorMessage.value = ''
  modalInstance?.show()
}

const closeModal = () => {
  modalInstance?.hide()
}

const saveStaff = async () => {
  try {
    const url = formMode.value === 'create'
      ? `${API_BASE}/api/staf`
      : `${API_BASE}/api/staf/${encodeURIComponent(form.id)}`
    const method = formMode.value === 'create' ? 'POST' : 'PUT'
    const payload: any = {
      nama: form.nama,
      username: form.username,
      email: form.email || null,
      jabatan: form.jabatan || null
    }

    if (formMode.value === 'create') {
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
      errorMessage.value = result.message || 'Gagal menyimpan data staf'
      return
    }

    await loadStaffs()
    closeModal()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Terjadi kesalahan saat menyimpan data staf'
  }
}

const deleteStaff = async (id: string | number) => {
  if (!confirm('Hapus staf ini dari sistem?')) return
  try {
    const response = await fetch(`${API_BASE}/api/staf/${encodeURIComponent(id)}`, { method: 'DELETE' })
    if (!response.ok) throw new Error('Gagal menghapus staf')
    await loadStaffs()
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  modalInstance = new Modal(modalRef.value!)
  await loadStaffs()
})
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
}
</style>
