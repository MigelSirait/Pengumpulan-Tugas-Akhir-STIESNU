import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path'
import db from './db.js'

dotenv.config()

const app = express()
const port = process.env.API_PORT || 3000

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Hanya file PDF, DOC, atau DOCX yang diperbolehkan'))
    }
  }
})

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173'
]

app.use(cors({ origin: allowedOrigins }))
app.use(express.json())
app.use('/uploads', express.static(path.resolve('uploads')))

app.get('/', (_req, res) => {
  res.send('STIESNU backend berjalan. Gunakan endpoint /api/health untuk pengecekan.')
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'STIESNU backend berjalan' })
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' })
  }

  try {
    const [rows] = await db.query(
      `SELECT 'admin' AS role, id, username, nama, email FROM admin WHERE username = ? AND password = ?
       UNION ALL
       SELECT 'staf' AS role, id, username, nama, email FROM staf WHERE username = ? AND password = ?
       UNION ALL
       SELECT 'mahasiswa' AS role, nim AS id, username, nama, email FROM mahasiswa WHERE username = ? AND password = ?`,
      [username, password, username, password, username, password]
    )

    if (!rows.length) {
      return res.status(401).json({ message: 'Login gagal. Username atau password salah.' })
    }

    const user = rows[0]
    return res.json({ message: 'Login berhasil', user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Terjadi kesalahan server saat login' })
  }
})

app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params
    const [rows] = await db.query(
      `SELECT 'admin' AS role, id, username, nama, email FROM admin WHERE username = ?
       UNION ALL
       SELECT 'staf' AS role, id, username, nama, email FROM staf WHERE username = ?
       UNION ALL
       SELECT 'mahasiswa' AS role, nim AS id, username, nama, email FROM mahasiswa WHERE username = ?`,
      [username, username, username]
    )

    if (!rows.length) {
      return res.status(404).json({ message: 'User tidak ditemukan' })
    }

    const user = rows[0]
    return res.json({ user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Gagal mengambil data user' })
  }
})

app.get('/api/mahasiswa', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT nim, nama, username, email, prodi, angkatan FROM mahasiswa')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data mahasiswa' })
  }
})

app.get('/api/staf', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nama, username, email, jabatan FROM staf')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data staf' })
  }
})

app.get('/api/admin', async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nama, username, email FROM admin')
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data admin' })
  }
})

app.get('/api/mahasiswa/:nim', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT nim, nama, username, email, prodi, angkatan FROM mahasiswa WHERE nim = ?', [req.params.nim])
    if (!rows.length) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' })
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data mahasiswa' })
  }
})

app.post('/api/mahasiswa', async (req, res) => {
  try {
    const { nim, nama, username, password, email, prodi, angkatan } = req.body
    if (!nim || !nama || !username || !password) {
      return res.status(400).json({ message: 'NIM, nama, username, dan password wajib diisi' })
    }
    await db.query(
      'INSERT INTO mahasiswa (nim, nama, username, password, email, prodi, angkatan) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nim, nama, username, password, email || null, prodi || null, angkatan || null]
    )
    res.json({ message: 'Mahasiswa berhasil ditambahkan' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menambahkan mahasiswa' })
  }
})

app.put('/api/mahasiswa/:nim', async (req, res) => {
  try {
    const { nim } = req.params
    const { nama, username, password, email, prodi, angkatan } = req.body
    const updateFields = []
    const params = []

    if (nama) { updateFields.push('nama = ?'); params.push(nama) }
    if (username) { updateFields.push('username = ?'); params.push(username) }
    if (password) { updateFields.push('password = ?'); params.push(password) }
    if (email !== undefined) { updateFields.push('email = ?'); params.push(email) }
    if (prodi !== undefined) { updateFields.push('prodi = ?'); params.push(prodi) }
    if (angkatan !== undefined) { updateFields.push('angkatan = ?'); params.push(angkatan) }

    if (!updateFields.length) {
      return res.status(400).json({ message: 'Tidak ada data yang diubah' })
    }

    params.push(nim)
    await db.query(`UPDATE mahasiswa SET ${updateFields.join(', ')} WHERE nim = ?`, params)
    res.json({ message: 'Data mahasiswa berhasil diperbarui' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal memperbarui mahasiswa' })
  }
})

app.delete('/api/mahasiswa/:nim', async (req, res) => {
  try {
    await db.query('DELETE FROM mahasiswa WHERE nim = ?', [req.params.nim])
    res.json({ message: 'Mahasiswa berhasil dihapus' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menghapus mahasiswa' })
  }
})

// Get semua pengajuan seminar untuk staf
app.get('/api/staf/seminar', async (req, res) => {
  try {
    const { jenis } = req.query
    let query = 'SELECT ps.*, m.nama, m.prodi FROM pengajuan_seminar ps JOIN mahasiswa m ON ps.mahasiswa_nim = m.nim'
    let params = []

    if (jenis) {
      query += ' WHERE ps.jenis = ?'
      params.push(jenis)
    }

    query += ' ORDER BY ps.tanggal_pengajuan DESC'

    const [rows] = await db.query(query, params)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data pengajuan seminar' })
  }
})

app.get('/api/staf/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nama, username, email, jabatan FROM staf WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ message: 'Staf tidak ditemukan' })
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data staf' })
  }
})

app.post('/api/staf', async (req, res) => {
  try {
    const { nama, username, password, email, jabatan } = req.body
    if (!nama || !username || !password) {
      return res.status(400).json({ message: 'Nama, username, dan password wajib diisi' })
    }
    await db.query(
      'INSERT INTO staf (nama, username, password, email, jabatan) VALUES (?, ?, ?, ?, ?)',
      [nama, username, password, email || null, jabatan || null]
    )
    res.json({ message: 'Staf berhasil ditambahkan' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menambahkan staf' })
  }
})

app.put('/api/staf/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { nama, username, password, email, jabatan } = req.body
    const updateFields = []
    const params = []

    if (nama) { updateFields.push('nama = ?'); params.push(nama) }
    if (username) { updateFields.push('username = ?'); params.push(username) }
    if (password) { updateFields.push('password = ?'); params.push(password) }
    if (email !== undefined) { updateFields.push('email = ?'); params.push(email) }
    if (jabatan !== undefined) { updateFields.push('jabatan = ?'); params.push(jabatan) }

    if (!updateFields.length) {
      return res.status(400).json({ message: 'Tidak ada data yang diubah' })
    }

    params.push(id)
    await db.query(`UPDATE staf SET ${updateFields.join(', ')} WHERE id = ?`, params)
    res.json({ message: 'Data staf berhasil diperbarui' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal memperbarui staf' })
  }
})

app.delete('/api/staf/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM staf WHERE id = ?', [req.params.id])
    res.json({ message: 'Staf berhasil dihapus' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menghapus staf' })
  }
})

app.get('/api/admin/tugas-akhir/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT ta.*, m.nama, m.prodi FROM tugas_akhir ta JOIN mahasiswa m ON ta.mahasiswa_nim = m.nim WHERE ta.id = ?',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ message: 'Tugas akhir tidak ditemukan' })
    res.json(rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data tugas akhir' })
  }
})

app.post('/api/admin/tugas-akhir', async (req, res) => {
  try {
    const { mahasiswa_nim, jenis, judul, status, catatan } = req.body
    if (!mahasiswa_nim || !jenis || !judul) {
      return res.status(400).json({ message: 'NIM mahasiswa, jenis, dan judul wajib diisi' })
    }
    await db.query(
      'INSERT INTO tugas_akhir (mahasiswa_nim, jenis, judul, status, catatan) VALUES (?, ?, ?, ?, ?)',
      [mahasiswa_nim, jenis, judul, status || 'menunggu', catatan || null]
    )
    res.json({ message: 'Tugas akhir berhasil ditambahkan' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menambahkan tugas akhir' })
  }
})

app.put('/api/admin/tugas-akhir/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { jenis, judul, status, catatan, tanggal_pengajuan, tanggal_approval } = req.body
    const updateFields = []
    const params = []

    if (jenis !== undefined) { updateFields.push('jenis = ?'); params.push(jenis) }
    if (judul !== undefined) { updateFields.push('judul = ?'); params.push(judul) }
    if (status !== undefined) { updateFields.push('status = ?'); params.push(status) }
    if (catatan !== undefined) { updateFields.push('catatan = ?'); params.push(catatan) }
    if (tanggal_pengajuan !== undefined) { updateFields.push('tanggal_pengajuan = ?'); params.push(tanggal_pengajuan) }
    if (tanggal_approval !== undefined) { updateFields.push('tanggal_approval = ?'); params.push(tanggal_approval) }

    if (!updateFields.length) {
      return res.status(400).json({ message: 'Tidak ada data yang diubah' })
    }

    params.push(id)
    await db.query(`UPDATE tugas_akhir SET ${updateFields.join(', ')} WHERE id = ?`, params)
    res.json({ message: 'Data tugas akhir berhasil diperbarui' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal memperbarui tugas akhir' })
  }
})

app.delete('/api/admin/tugas-akhir/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM tugas_akhir WHERE id = ?', [req.params.id])
    res.json({ message: 'Tugas akhir berhasil dihapus' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal menghapus tugas akhir' })
  }
})

// === ENDPOINT TUGAS AKHIR (Mahasiswa -> Admin) ===

// Get tugas akhir mahasiswa
app.get('/api/tugas-akhir/:nim', async (req, res) => {
  try {
    const { nim } = req.params
    const [rows] = await db.query(
      'SELECT ta.*, m.nama, m.prodi FROM tugas_akhir ta JOIN mahasiswa m ON ta.mahasiswa_nim = m.nim WHERE ta.mahasiswa_nim = ?',
      [nim]
    )
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data tugas akhir' })
  }
})

// Get semua tugas akhir untuk admin
app.get('/api/admin/tugas-akhir', async (req, res) => {
  try {
    const { jenis } = req.query
    let query = 'SELECT ta.*, m.nama, m.prodi FROM tugas_akhir ta JOIN mahasiswa m ON ta.mahasiswa_nim = m.nim'
    let params = []

    if (jenis) {
      query += ' WHERE ta.jenis = ?'
      params.push(jenis)
    }

    query += ' ORDER BY ta.tanggal_pengajuan DESC'

    const [rows] = await db.query(query, params)
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data tugas akhir' })
  }
})

// Submit tugas akhir (mahasiswa)
app.post('/api/tugas-akhir', upload.single('file'), async (req, res) => {
  try {
    const { nim, jenis, judul } = req.body
    const file_path = req.file ? req.file.path : null

    if (!nim || !jenis || !judul) {
      return res.status(400).json({ message: 'NIM, jenis, dan judul wajib diisi' })
    }

    await db.query(
      'INSERT INTO tugas_akhir (mahasiswa_nim, jenis, judul, status, file_path) VALUES (?, ?, ?, ?, ?)',
      [nim, jenis, judul, 'menunggu', file_path]
    )

    res.json({ message: 'Tugas akhir berhasil diajukan' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengajukan tugas akhir' })
  }
})

// === ENDPOINT PENGAJUAN SEMINAR (Mahasiswa -> Staf) ===

// Get pengajuan seminar mahasiswa
app.get('/api/seminar/:nim', async (req, res) => {
  try {
    const { nim } = req.params
    const [rows] = await db.query(
      'SELECT ps.*, m.nama, m.prodi FROM pengajuan_seminar ps JOIN mahasiswa m ON ps.mahasiswa_nim = m.nim WHERE ps.mahasiswa_nim = ?',
      [nim]
    )
    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengambil data pengajuan seminar' })
  }
})

// Submit pengajuan seminar (mahasiswa)
app.post('/api/seminar', upload.fields([
  { name: 'berkas_proposal', maxCount: 1 },
  { name: 'berkas_penilaian', maxCount: 1 },
  { name: 'berkas_pengantar', maxCount: 1 }
]), async (req, res) => {
  try {
    const { nim, jenis, judul } = req.body
    const files = req.files || {}

    if (!nim || !jenis || !judul) {
      return res.status(400).json({ message: 'NIM, jenis, dan judul wajib diisi' })
    }

    const berkas_proposal = files.berkas_proposal ? files.berkas_proposal[0].path : null
    const berkas_penilaian = files.berkas_penilaian ? files.berkas_penilaian[0].path : null
    const berkas_pengantar = files.berkas_pengantar ? files.berkas_pengantar[0].path : null

    await db.query(
      'INSERT INTO pengajuan_seminar (mahasiswa_nim, jenis, judul, status, berkas_proposal, berkas_penilaian, berkas_pengantar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nim, jenis, judul, 'menunggu', berkas_proposal, berkas_penilaian, berkas_pengantar]
    )

    res.json({ message: 'Pengajuan seminar berhasil diajukan' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal mengajukan seminar' })
  }
})

// Approve/Reject/Schedule pengajuan seminar (staf)
app.put('/api/staf/seminar/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status, catatan_staf, tanggal_jadwal } = req.body

    if (!['disetujui', 'ditolak', 'dijadwalkan'].includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' })
    }

    let updateFields = 'status = ?, catatan_staf = ?'
    let params = [status, catatan_staf || null]

    if (tanggal_jadwal && status === 'dijadwalkan') {
      updateFields += ', tanggal_jadwal = ?'
      params.push(tanggal_jadwal)
    }

    params.push(id)

    await db.query(
      `UPDATE pengajuan_seminar SET ${updateFields} WHERE id = ?`,
      params
    )

    res.json({ message: `Pengajuan seminar ${status}` })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Gagal memproses pengajuan seminar' })
  }
})

app.listen(port, () => {
  console.log(`Backend STIESNU berjalan di http://localhost:${port}`)
})
