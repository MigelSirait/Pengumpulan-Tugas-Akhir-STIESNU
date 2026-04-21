<template>
  <div class="container-fluid py-4">
    <div class="card shadow-sm">
      <div class="card-header bg-white border-bottom">
        <h5 class="mb-0">Unggah Berkas Tugas Akhir</h5>
      </div>
      <div class="card-body">
        <p class="text-muted">Silakan unggah dokumen tugas akhir Anda. File akan dikirim ke backend untuk diproses oleh staf/admin.</p>

        <div v-if="statusMessage" :class="['alert', statusClass]" role="alert">
          {{ statusMessage }}
        </div>

        <form @submit.prevent="submitForm" class="row g-3">
          <div class="col-md-6">
            <label for="nim" class="form-label">NIM</label>
            <input id="nim" v-model="form.nim" type="text" class="form-control" placeholder="Masukkan NIM" required />
          </div>

          <div class="col-md-6">
            <label for="jenis" class="form-label">Jenis Pengajuan</label>
            <select id="jenis" v-model="form.jenis" class="form-select" required>
              <option value="">Pilih jenis</option>
              <option value="outline">Outline Skripsi</option>
              <option value="proposal">Pengumpulan Proposal</option>
              <option value="skripsi">Pengumpulan Skripsi</option>
            </select>
          </div>

          <div class="col-12">
            <label for="judul" class="form-label">Judul Tugas Akhir</label>
            <input id="judul" v-model="form.judul" type="text" class="form-control" placeholder="Masukkan judul tugas akhir" required />
          </div>

          <div class="col-12">
            <label class="form-label">File Tugas Akhir</label>
            <div class="input-group">
              <input type="file" class="form-control" @change="handleFileChange" accept=".pdf,.doc,.docx" required />
            </div>
            <div class="form-text">Format file: PDF, DOC, DOCX. Maksimum 10MB.</div>
            <div class="mt-2" v-if="fileName">
              <strong>File dipilih:</strong> {{ fileName }}
            </div>
          </div>

          <div class="col-12 text-end">
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              {{ submitting ? 'Mengunggah...' : 'Unggah Tugas Akhir' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const form = reactive({
  nim: '',
  jenis: '',
  judul: ''
})
const file = ref<File | null>(null)
const fileName = ref('')
const submitting = ref(false)
const statusMessage = ref('')
const statusClass = ref('alert-info')

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selected = target.files?.[0] || null
  file.value = selected
  fileName.value = selected ? selected.name : ''
}

const submitForm = async () => {
  if (!form.nim || !form.jenis || !form.judul || !file.value) {
    statusMessage.value = 'Semua field dan file harus diisi.'
    statusClass.value = 'alert-warning'
    return
  }

  const body = new FormData()
  body.append('nim', form.nim)
  body.append('jenis', form.jenis)
  body.append('judul', form.judul)
  body.append('file', file.value)

  submitting.value = true
  statusMessage.value = ''

  try {
    const response = await fetch(`${API_BASE}/api/tugas-akhir`, {
      method: 'POST',
      body
    })

    const result = await response.json()

    if (!response.ok) {
      statusMessage.value = result.message || 'Gagal mengunggah tugas akhir.'
      statusClass.value = 'alert-danger'
    } else {
      statusMessage.value = result.message || 'Pengajuan tugas akhir berhasil dikirim.'
      statusClass.value = 'alert-success'
      form.nim = ''
      form.jenis = ''
      form.judul = ''
      file.value = null
      fileName.value = ''
    }
  } catch (error) {
    console.error(error)
    statusMessage.value = 'Terjadi kesalahan jaringan saat mengunggah.'
    statusClass.value = 'alert-danger'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
}
</style>
