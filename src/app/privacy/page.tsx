"use client";
import LegalLayout from "@/components/LegalLayout";
import { useLang } from "@/contexts/LanguageContext";

export default function PrivacyPage() {
  const { lang } = useLang();
  const isID = lang === "id";

  return (
    <LegalLayout
      title={isID ? "Kebijakan Privasi" : "Privacy Policy"}
      lastUpdated="19 May 2026">
      {isID ? (
        <>
          <h2>1. Pendahuluan</h2>
          <p>
            tapToGo (taptogo.id) menghargai privasi Anda. Kebijakan ini menjelaskan data apa yang
            kami kumpulkan, bagaimana kami menggunakannya, dan hak Anda atas data tersebut.
          </p>

          <h2>2. Data yang Kami Kumpulkan</h2>
          <p>Saat Anda melakukan pemesanan, kami mengumpulkan:</p>
          <ul>
            <li><strong>Nama lengkap</strong> – untuk manifest penumpang & e-ticket</li>
            <li><strong>Alamat email</strong> – untuk pengiriman e-ticket</li>
            <li><strong>Nomor telepon / WhatsApp</strong> – untuk konfirmasi & komunikasi</li>
            <li><strong>Kewarganegaraan</strong> – untuk persyaratan operator</li>
            <li><strong>Nomor identitas (opsional)</strong> – KTP / Paspor jika diperlukan operator</li>
            <li><strong>Detail pemesanan</strong> – rute, tanggal, jumlah penumpang, harga</li>
          </ul>

          <h2>3. Bagaimana Kami Menggunakan Data Anda</h2>
          <ul>
            <li>Memproses pemesanan & menerbitkan e-ticket</li>
            <li>Menghubungi Anda terkait booking, pembayaran, atau perubahan jadwal</li>
            <li>Mengirim data penumpang ke operator fastboat untuk manifest</li>
            <li>Memenuhi kewajiban hukum (laporan ke otoritas pelabuhan jika diminta)</li>
            <li>Memperbaiki layanan & analitik internal (anonim)</li>
          </ul>

          <h2>4. Dengan Siapa Kami Berbagi Data</h2>
          <p>Data Anda <strong>hanya</strong> dibagikan ke:</p>
          <ul>
            <li><strong>Operator fastboat</strong> yang Anda pilih – untuk manifest penumpang & boarding</li>
            <li><strong>Penyedia layanan teknis</strong> – Vercel (hosting), Google Analytics (analitik anonim)</li>
            <li><strong>Otoritas yang berwenang</strong> – jika diwajibkan oleh hukum</li>
          </ul>
          <p>
            Kami <strong>tidak pernah</strong> menjual data Anda ke pihak ketiga untuk tujuan pemasaran.
          </p>

          <h2>5. Penyimpanan Data</h2>
          <p>
            Data booking disimpan selama <strong>2 tahun</strong> untuk keperluan administrasi & audit.
            Setelah itu, data akan dihapus secara permanen kecuali ada kewajiban hukum yang menahan.
          </p>

          <h2>6. Cookies & Tracking</h2>
          <p>Kami menggunakan cookies minimal untuk:</p>
          <ul>
            <li>Menyimpan preferensi bahasa (Indonesia / English)</li>
            <li>Google Analytics (anonim, untuk memahami trafik website)</li>
          </ul>
          <p>Anda dapat menonaktifkan cookies di pengaturan browser. Beberapa fitur mungkin tidak berfungsi optimal.</p>

          <h2>7. Hak Anda</h2>
          <p>Anda berhak untuk:</p>
          <ul>
            <li><strong>Akses</strong> – meminta salinan data Anda</li>
            <li><strong>Koreksi</strong> – memperbaiki data yang salah</li>
            <li><strong>Penghapusan</strong> – meminta data Anda dihapus (setelah booking selesai)</li>
            <li><strong>Penarikan persetujuan</strong> – berhenti menerima komunikasi non-transaksional</li>
          </ul>
          <p>Untuk menggunakan hak ini, hubungi kami via WhatsApp.</p>

          <h2>8. Keamanan</h2>
          <p>
            Kami menerapkan langkah keamanan teknis (SSL/HTTPS, akses terbatas) untuk melindungi data
            Anda. Namun tidak ada sistem yang 100% aman; kami akan memberi tahu Anda jika terjadi
            insiden yang memengaruhi data Anda.
          </p>

          <h2>9. Anak di Bawah Umur</h2>
          <p>
            Layanan kami tidak ditujukan untuk anak di bawah 18 tahun. Pemesanan untuk anak harus
            dilakukan oleh orang tua atau wali.
          </p>

          <h2>10. Perubahan Kebijakan</h2>
          <p>
            Kami dapat memperbarui kebijakan ini sewaktu-waktu. Versi terbaru selalu tersedia di
            halaman ini. Tanggal pembaruan tercantum di bagian atas.
          </p>

          <h2>11. Kontak</h2>
          <ul>
            <li>WhatsApp: <a href="https://wa.me/6287821775082">+62 878 2177 5082</a></li>
            <li>Website: <a href="https://taptogo.id">taptogo.id</a></li>
          </ul>
        </>
      ) : (
        <>
          <h2>1. Introduction</h2>
          <p>
            tapToGo (taptogo.id) respects your privacy. This Policy explains what data we collect,
            how we use it, and your rights regarding that data.
          </p>

          <h2>2. Data We Collect</h2>
          <p>When you make a booking, we collect:</p>
          <ul>
            <li><strong>Full name</strong> – for passenger manifest & e-ticket</li>
            <li><strong>Email address</strong> – for e-ticket delivery</li>
            <li><strong>Phone / WhatsApp number</strong> – for confirmation & communication</li>
            <li><strong>Nationality</strong> – required by some operators</li>
            <li><strong>ID number (optional)</strong> – KTP / Passport if required by the operator</li>
            <li><strong>Booking details</strong> – route, date, passenger count, price</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <ul>
            <li>Process bookings & issue e-tickets</li>
            <li>Contact you about your booking, payment, or schedule changes</li>
            <li>Send passenger data to the fastboat operator for the manifest</li>
            <li>Comply with legal obligations (port authority reporting if requested)</li>
            <li>Improve our service & internal analytics (anonymized)</li>
          </ul>

          <h2>4. Who We Share Data With</h2>
          <p>Your data is <strong>only</strong> shared with:</p>
          <ul>
            <li><strong>Your chosen fastboat operator</strong> – for passenger manifest & boarding</li>
            <li><strong>Technical service providers</strong> – Vercel (hosting), Google Analytics (anonymized analytics)</li>
            <li><strong>Authorities</strong> – if required by law</li>
          </ul>
          <p>
            We <strong>never</strong> sell your data to third parties for marketing purposes.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            Booking data is retained for <strong>2 years</strong> for administrative and audit purposes.
            After that, data is permanently deleted unless legal obligations require otherwise.
          </p>

          <h2>6. Cookies & Tracking</h2>
          <p>We use minimal cookies for:</p>
          <ul>
            <li>Storing language preference (Indonesian / English)</li>
            <li>Google Analytics (anonymous, to understand website traffic)</li>
          </ul>
          <p>You can disable cookies in your browser settings. Some features may not work optimally.</p>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> – request a copy of your data</li>
            <li><strong>Correction</strong> – correct inaccurate data</li>
            <li><strong>Deletion</strong> – request your data be deleted (after booking is complete)</li>
            <li><strong>Withdraw consent</strong> – stop receiving non-transactional communications</li>
          </ul>
          <p>To exercise these rights, contact us via WhatsApp.</p>

          <h2>8. Security</h2>
          <p>
            We apply technical security measures (SSL/HTTPS, limited access) to protect your data.
            However, no system is 100% secure; we will notify you of any incident affecting your data.
          </p>

          <h2>9. Minors</h2>
          <p>
            Our service is not intended for users under 18. Bookings for children must be made by a
            parent or guardian.
          </p>

          <h2>10. Policy Changes</h2>
          <p>
            We may update this policy at any time. The latest version is always available on this page.
            The update date is shown at the top.
          </p>

          <h2>11. Contact</h2>
          <ul>
            <li>WhatsApp: <a href="https://wa.me/6287821775082">+62 878 2177 5082</a></li>
            <li>Website: <a href="https://taptogo.id">taptogo.id</a></li>
          </ul>
        </>
      )}
    </LegalLayout>
  );
}
