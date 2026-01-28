"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  GraduationCap,
  Users,
  MapPin,
  Calendar,
  FileCheck,
  ChevronRight,
  School,
  Award,
  Clock,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  BookOpen,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useDataStore } from "@/lib/store";

// ============================================
// Navigation Component
// ============================================

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/90 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-primary">SPMB</span>
              <span className="hidden sm:block text-xs text-gray-500">
                Penerimaan Murid Baru
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#alur" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Alur Pendaftaran
            </a>
            <a href="#jadwal" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Jadwal
            </a>
            <a href="#jalur" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Jalur Pendaftaran
            </a>
            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              FAQ
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">
                Daftar Sekarang
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-4 space-y-3">
            <a href="#alur" className="block py-2 text-gray-600">Alur Pendaftaran</a>
            <a href="#jadwal" className="block py-2 text-gray-600">Jadwal</a>
            <a href="#jalur" className="block py-2 text-gray-600">Jalur Pendaftaran</a>
            <a href="#faq" className="block py-2 text-gray-600">FAQ</a>
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/login">
                <Button variant="outline" className="w-full">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button className="w-full">Daftar Sekarang</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

// ============================================
// Hero Section
// ============================================

function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-tertiary/5">
        <motion.div
          style={{ y }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: useTransform(scrollY, [0, 500], [0, 100]) }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        />
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 text-6xl"
        >
          📚
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-1/3 left-1/4 text-5xl"
        >
          🎓
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/3 left-1/6 text-4xl"
        >
          ⭐
        </motion.div>
      </div>

      <motion.div style={{ opacity }} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6"
            >
              <span className="animate-pulse-soft">🔔</span>
              Pendaftaran Tahun Ajaran 2026/2027 Dibuka!
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Sistem Penerimaan
              <span className="block text-gradient-primary">Murid Baru</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg text-gray-600 leading-relaxed max-w-lg"
            >
              Platform pendaftaran online untuk jenjang <strong>SD</strong> dan{" "}
              <strong>SMP</strong> di bawah naungan Dinas Pendidikan. Proses mudah,
              transparan, dan cepat.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link href="/register">
                <Button size="xl" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Daftar Sekarang
                </Button>
              </Link>
              <a href="#alur">
                <Button variant="outline" size="xl">
                  Lihat Alur Pendaftaran
                </Button>
              </a>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              {[
                { value: "100+", label: "Sekolah" },
                { value: "5000+", label: "Pendaftar" },
                { value: "99%", label: "Kepuasan" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
                    <School className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Pilih Jenjang</h3>
                    <p className="text-sm text-gray-500">SD atau SMP</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl cursor-pointer"
                  >
                    <div className="text-3xl mb-2">🏫</div>
                    <div className="font-semibold text-blue-700">SD</div>
                    <div className="text-xs text-blue-600">Sekolah Dasar</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl cursor-pointer"
                  >
                    <div className="text-3xl mb-2">🎒</div>
                    <div className="font-semibold text-green-700">SMP</div>
                    <div className="text-xs text-green-600">Sekolah Menengah</div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, 15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-10 -right-10 bg-white rounded-2xl shadow-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Terverifikasi</div>
                    <div className="text-xs text-gray-500">Pendaftaran Berhasil</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Jalur Prestasi</div>
                    <div className="text-xs text-gray-500">Kuota Tersedia</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// Registration Flow Section
// ============================================

function RegistrationFlowSection() {
  const steps = [
    {
      icon: Users,
      title: "Registrasi Akun",
      description: "Buat akun dengan data diri yang valid",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: School,
      title: "Pilih Sekolah",
      description: "Tentukan jenjang dan sekolah tujuan",
      color: "from-green-500 to-green-600",
    },
    {
      icon: MapPin,
      title: "Pilih Jalur",
      description: "Zonasi, Prestasi, atau Afirmasi",
      color: "from-amber-500 to-amber-600",
    },
    {
      icon: FileCheck,
      title: "Upload Berkas",
      description: "Lengkapi dokumen yang diperlukan",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: Clock,
      title: "Tunggu Verifikasi",
      description: "Berkas akan diverifikasi oleh sekolah",
      color: "from-rose-500 to-rose-600",
    },
    {
      icon: CheckCircle2,
      title: "Pengumuman",
      description: "Lihat hasil seleksi dan daftar ulang",
      color: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <section id="alur" className="py-20 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Alur Pendaftaran
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            6 langkah mudah untuk mendaftarkan putra/putri Anda ke sekolah impian
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}
                >
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-400 mb-1">
                    Langkah {index + 1}
                  </div>
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ChevronRight className="h-6 w-6 text-gray-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Schedule Section
// ============================================

function ScheduleSection() {
  const schedules = [
    {
      date: "15 Januari - 28 Februari 2026",
      title: "Pendaftaran Online",
      description: "Periode pendaftaran dan upload berkas",
      status: "active",
    },
    {
      date: "1 - 10 Maret 2026",
      title: "Verifikasi Berkas",
      description: "Proses verifikasi oleh sekolah",
      status: "upcoming",
    },
    {
      date: "15 Maret 2026",
      title: "Pengumuman Hasil",
      description: "Pengumuman hasil seleksi",
      status: "upcoming",
    },
    {
      date: "20 - 31 Maret 2026",
      title: "Daftar Ulang",
      description: "Konfirmasi dan finalisasi pendaftaran",
      status: "upcoming",
    },
  ];

  return (
    <section id="jadwal" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Jadwal Pendaftaran
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Tahun Ajaran 2026/2027
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {schedules.map((schedule, index) => (
            <motion.div
              key={schedule.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex gap-6 pb-8 last:pb-0"
            >
              {/* Timeline Line */}
              {index < schedules.length - 1 && (
                <div className="absolute left-[19px] top-12 w-0.5 h-full bg-gray-200" />
              )}

              {/* Timeline Dot */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${schedule.status === "active"
                    ? "bg-gradient-primary shadow-lg shadow-primary/30"
                    : "bg-gray-200"
                  }`}
              >
                <Calendar
                  className={`h-5 w-5 ${schedule.status === "active" ? "text-white" : "text-gray-500"
                    }`}
                />
              </div>

              {/* Content */}
              <div
                className={`flex-1 bg-white rounded-2xl p-6 border transition-all ${schedule.status === "active"
                    ? "border-primary shadow-lg"
                    : "border-gray-100 hover:border-gray-200"
                  }`}
              >
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${schedule.status === "active"
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {schedule.date}
                  </span>
                  {schedule.status === "active" && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Sedang Berlangsung
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900">{schedule.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{schedule.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Registration Paths Section
// ============================================

function RegistrationPathsSection() {
  const paths = [
    {
      icon: MapPin,
      title: "Jalur Zonasi",
      description: "Berdasarkan jarak tempat tinggal ke sekolah. Semakin dekat, semakin tinggi prioritas.",
      quota: "50%",
      color: "primary",
      features: ["Berdomisili di wilayah zonasi", "Kartu Keluarga", "Akta Kelahiran"],
    },
    {
      icon: Award,
      title: "Jalur Prestasi",
      description: "Untuk siswa dengan prestasi akademik dan non-akademik tingkat kabupaten ke atas.",
      quota: "25%",
      color: "secondary",
      features: ["Sertifikat prestasi", "Tingkat kabupaten/provinsi/nasional", "2 tahun terakhir"],
    },
    {
      icon: Star,
      title: "Jalur Afirmasi",
      description: "Untuk siswa dari keluarga tidak mampu yang terdaftar dalam DTKS.",
      quota: "15%",
      color: "tertiary",
      features: ["Kartu Indonesia Pintar", "Terdaftar DTKS", "SKTM dari kelurahan"],
    },
    {
      icon: Users,
      title: "Jalur Perpindahan",
      description: "Untuk anak yang mengikuti perpindahan tugas orang tua/wali.",
      quota: "10%",
      color: "primary",
      features: ["Surat tugas perpindahan", "Tahun berjalan", "Alamat baru sesuai wilayah"],
    },
  ];

  return (
    <section id="jalur" className="py-20 md:py-32 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Jalur Pendaftaran
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih jalur yang sesuai dengan kondisi dan prestasi putra/putri Anda
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {paths.map((path, index) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-xl bg-${path.color}/10 flex items-center justify-center`}>
                  <path.icon className={`h-7 w-7 text-${path.color}`} />
                </div>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                  Kuota {path.quota}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {path.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{path.description}</p>
              <div className="space-y-2">
                {path.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// FAQ Section
// ============================================

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Bagaimana cara mendaftar SPMB online?",
      answer: "Pertama, buat akun dengan klik tombol 'Daftar Sekarang'. Kemudian lengkapi data diri, pilih jenjang dan sekolah tujuan, pilih jalur pendaftaran, upload berkas yang diperlukan, dan tunggu verifikasi dari sekolah.",
    },
    {
      question: "Apa saja berkas yang harus disiapkan?",
      answer: "Berkas umum yang diperlukan: Kartu Keluarga, Akta Kelahiran, Ijazah/Surat Keterangan Lulus, dan Pas Foto 3x4. Untuk jalur tertentu diperlukan dokumen tambahan seperti Sertifikat Prestasi atau KIP.",
    },
    {
      question: "Bagaimana sistem zonasi bekerja?",
      answer: "Sistem zonasi menghitung jarak antara alamat rumah (sesuai KK) dengan lokasi sekolah. Anda akan diminta menandai lokasi rumah di peta. Semakin dekat jarak, semakin tinggi skor zonasi Anda.",
    },
    {
      question: "Bisakah mendaftar ke lebih dari satu sekolah?",
      answer: "Untuk satu periode pendaftaran, Anda hanya dapat mendaftar ke satu sekolah tujuan. Pastikan memilih sekolah dengan cermat sebelum melakukan pendaftaran.",
    },
    {
      question: "Bagaimana cara melihat hasil seleksi?",
      answer: "Hasil seleksi akan diumumkan sesuai jadwal yang telah ditentukan. Anda dapat melihat hasilnya dengan login ke akun dan masuk ke menu 'Pengumuman'. Notifikasi juga akan dikirim via WhatsApp.",
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Pertanyaan Umum
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                <ChevronRight
                  className={`h-5 w-5 text-gray-400 transition-transform ${openIndex === index ? "rotate-90" : ""
                    }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-4 text-gray-600">{faq.answer}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// CTA Section
// ============================================

function CTASection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 md:p-16"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="relative text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Mendaftarkan Putra/Putri Anda?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Jangan lewatkan kesempatan untuk bergabung dengan sekolah terbaik
              di wilayah Anda. Proses pendaftaran mudah dan transparan.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button
                  variant="glass"
                  size="xl"
                  className="bg-white text-primary hover:bg-white/90"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Daftar Sekarang
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white text-white hover:bg-white/10"
                >
                  Sudah Punya Akun
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================
// Footer
// ============================================

function Footer() {
  return (
    <footer className="bg-tertiary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <span className="font-bold text-lg">SPMB</span>
                <span className="block text-xs text-white/60">
                  Penerimaan Murid Baru
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm max-w-md">
              Sistem Penerimaan Murid Baru Online untuk jenjang SD dan SMP di
              bawah naungan Dinas Pendidikan Kabupaten.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Tautan</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#alur" className="hover:text-white transition-colors">Alur Pendaftaran</a></li>
              <li><a href="#jadwal" className="hover:text-white transition-colors">Jadwal</a></li>
              <li><a href="#jalur" className="hover:text-white transition-colors">Jalur Pendaftaran</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>📍 Jl. Pendidikan No. 1</li>
              <li>📞 (022) 1234567</li>
              <li>✉️ info@spmb.go.id</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm text-white/40">
          <p>© 2026 SPMB - Sistem Penerimaan Murid Baru. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Main Page Component
// ============================================

export default function HomePage() {
  const initialize = useDataStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <main>
      <Navbar />
      <HeroSection />
      <RegistrationFlowSection />
      <ScheduleSection />
      <RegistrationPathsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
