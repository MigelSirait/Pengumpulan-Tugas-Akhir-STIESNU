import { createRouter, createWebHistory } from 'vue-router'
import HomeAdmin from './views/HomeAdmin.vue'
import HomeStaff from './views/HomeStaff.vue'
import HomeMahasiswa from './views/HomeMahasiswa.vue'
import Login from './views/Login.vue'
import DataDosen from './views/DataDosen.vue'
import DataMahasiswa from './views/DataMahasiswa.vue'
import KolegaJadwalSidang from './views/KolegaJadwalSidang.vue'
import UnggahBerkas from './views/UnggahBerkas.vue'
import StaffJadwalSeminarProposal from './views/staff-jadwal/seminar-proposal/index.vue'
import StaffJadwalSeminarHasil from './views/staff-jadwal/seminar-hasil/index.vue'
import StaffJadwalSidang from './views/staff-jadwal/sidang-skripsi/index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guest: true }
  },
  {
    path: '/home',
    name: 'Home',
    redirect: () => {
      const role = sessionStorage.getItem('simtama-role') || 'mahasiswa'
      if (role === 'admin') return '/home/admin'
      if (role === 'staf') return '/home/staf'
      return '/home/mahasiswa'
    },
    meta: { auth: true }
  },
  {
    path: '/home/admin',
    name: 'HomeAdmin',
    component: HomeAdmin,
    meta: { auth: true }
  },
  {
    path: '/home/staf',
    name: 'HomeStaff',
    component: HomeStaff,
    meta: { auth: true }
  },
  {
    path: '/staff/jadwal/seminar-proposal',
    name: 'StaffJadwalSeminarProposal',
    component: StaffJadwalSeminarProposal,
    meta: { auth: true }
  },
  {
    path: '/staff/jadwal/seminar-hasil',
    name: 'StaffJadwalSeminarHasil',
    component: StaffJadwalSeminarHasil,
    meta: { auth: true }
  },
  {
    path: '/staff/jadwal/sidang-skripsi',
    name: 'StaffJadwalSidang',
    component: StaffJadwalSidang,
    meta: { auth: true }
  },
  {
    path: '/home/mahasiswa',
    name: 'HomeMahasiswa',
    component: HomeMahasiswa,
    meta: { auth: true }
  },
  {
    path: '/data-staf',
    name: 'DataStaf',
    component: DataDosen,
    meta: { auth: true }
  },
  {
    path: '/data-mahasiswa',
    name: 'DataMahasiswa',
    component: DataMahasiswa,
    meta: { auth: true }
  },
  {
    path: '/kolega-jadwal-sidang',
    name: 'KolegaJadwalSidang',
    component: KolegaJadwalSidang,
    meta: { auth: true }
  },
  {
    path: '/unggah-berkas',
    name: 'UnggahBerkas',
    component: UnggahBerkas,
    meta: { auth: true }
  },
  {
    path: '/tugas-akhir',
    name: 'TugasAkhir',
    component: () => import('./views/TugasAkhir.vue'),
    meta: { auth: true }
  },
  {
    path: '/tugas-akhir/outline',
    name: 'TugasAkhirOutline',
    component: () => import('./views/TugasAkhir.vue'),
    meta: { auth: true }
  },
  {
    path: '/tugas-akhir/pengajuan-proposal',
    name: 'TugasAkhirProposal',
    component: () => import('./views/TugasAkhir.vue'),
    meta: { auth: true }
  },
  {
    path: '/tugas-akhir/seminar-proposal',
    name: 'TugasAkhirSeminarProposal',
    component: () => import('./views/TugasAkhir.vue'),
    meta: { auth: true }
  },
  {
    path: '/tugas-akhir/pengajuan-skripsi',
    name: 'TugasAkhirSkripsi',
    component: () => import('./views/TugasAkhir.vue'),
    meta: { auth: true }
  },
  {
    path: '/tugas-akhir/seminar-hasil',
    name: 'TugasAkhirSeminarHasil',
    component: () => import('./views/TugasAkhir.vue'),
    meta: { auth: true }
  },
  {
    path: '/tugas-akhir/sidang-skripsi',
    name: 'TugasAkhirSidang',
    component: () => import('./views/TugasAkhir.vue'),
    meta: { auth: true }
  },
  {
    path: '/admin/tugas-akhir/outline',
    name: 'AdminTugasAkhirOutline',
    component: () => import('./views/admin/TugasAkhirOutlineAdmin.vue'),
    meta: { auth: true }
  },
  {
    path: '/admin/tugas-akhir/pengajuan-proposal',
    name: 'AdminTugasAkhirProposal',
    component: () => import('./views/admin/TugasAkhirProposalAdmin.vue'),
    meta: { auth: true }
  },
  {
    path: '/admin/tugas-akhir/pengajuan-skripsi',
    name: 'AdminTugasAkhirSkripsi',
    component: () => import('./views/admin/TugasAkhirSkripsiAdmin.vue'),
    meta: { auth: true }
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/login'
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const isAuth = sessionStorage.getItem('simtama-auth') === 'true'

  if (!isAuth && to.name !== 'Login') {
    return { name: 'Login' }
  }

  if (isAuth && to.name === 'Login') {
    return { name: 'Home' }
  }

  if (to.meta.auth && !isAuth) {
    return { name: 'Login' }
  }

  if (to.meta.guest && isAuth) {
    return { name: 'Home' }
  }
})

export default router