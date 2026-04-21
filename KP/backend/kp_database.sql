-- Database STIESNU untuk mahasiswa, staf, dan admin
CREATE DATABASE IF NOT EXISTS `kp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `kp`;

CREATE TABLE IF NOT EXISTS `admin` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `staf` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `jabatan` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `mahasiswa` (
  `nim` VARCHAR(20) NOT NULL,
  `nama` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `prodi` VARCHAR(100) NOT NULL,
  `angkatan` YEAR NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`nim`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk pengajuan tugas akhir (outline, proposal, skripsi)
CREATE TABLE IF NOT EXISTS `tugas_akhir` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mahasiswa_nim` VARCHAR(20) NOT NULL,
  `jenis` ENUM('outline', 'proposal', 'skripsi') NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `status` ENUM('draft', 'menunggu', 'disetujui', 'dikembalikan') DEFAULT 'draft',
  `file_path` VARCHAR(255) DEFAULT NULL,
  `catatan` TEXT DEFAULT NULL,
  `tanggal_pengajuan` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `tanggal_approval` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mahasiswa_nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk pengajuan seminar/jadwal ke staf
CREATE TABLE IF NOT EXISTS `pengajuan_seminar` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `mahasiswa_nim` VARCHAR(20) NOT NULL,
  `jenis` ENUM('seminar-proposal', 'seminar-hasil', 'sidang-skripsi') NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `status` ENUM('draft', 'menunggu', 'disetujui', 'ditolak', 'dijadwalkan') DEFAULT 'draft',
  `berkas_proposal` VARCHAR(255) DEFAULT NULL,
  `berkas_penilaian` VARCHAR(255) DEFAULT NULL,
  `berkas_pengantar` VARCHAR(255) DEFAULT NULL,
  `catatan_staf` TEXT DEFAULT NULL,
  `tanggal_pengajuan` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `tanggal_jadwal` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`mahasiswa_nim`) REFERENCES `mahasiswa`(`nim`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `admin` (`nama`, `username`, `password`, `email`) VALUES
  ('Admin STIESNU', 'admin', 'admin', 'admin@stiesnu.ac.id');

INSERT IGNORE INTO `staf` (`nama`, `username`, `password`, `email`, `jabatan`) VALUES
  ('Staf Akademik', 'staf', 'staf', 'staf@stiesnu.ac.id', 'Akademik');

INSERT IGNORE INTO `mahasiswa` (`nim`, `nama`, `username`, `password`, `email`, `prodi`, `angkatan`) VALUES
  ('2024010001', 'Mahasiswa Demo', 'mahasiswa', '1234', 'mahasiswa@stiesnu.ac.id', 'Teknik Informatika', 2024);

INSERT IGNORE INTO `pengajuan_seminar` (`mahasiswa_nim`, `jenis`, `judul`, `status`) VALUES
  ('2024010001', 'seminar-proposal', 'Pengajuan Seminar Proposal Mahasiswa Demo', 'menunggu'),
  ('2024010001', 'seminar-hasil', 'Pengajuan Seminar Hasil Mahasiswa Demo', 'menunggu'),
  ('2024010001', 'sidang-skripsi', 'Pengajuan Sidang Skripsi Mahasiswa Demo', 'menunggu');