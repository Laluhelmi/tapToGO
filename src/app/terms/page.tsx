"use client";
import LegalLayout from "@/components/LegalLayout";
import { useLang } from "@/contexts/LanguageContext";

export default function TermsPage() {
  const { lang } = useLang();
  const isID = lang === "id";

  return (
    <LegalLayout
      title={isID ? "Syarat & Ketentuan" : "Terms of Service"}
      lastUpdated="19 May 2026">
      {isID ? (
        <>
          <h2>1. Tentang tapToGo</h2>
          <p>
            tapToGo (taptogo.id) adalah platform pemesanan tiket fastboat untuk rute Lombok–Bali.
            Kami adalah <strong>agen pemesanan</strong> yang menghubungkan penumpang dengan operator
            fastboat resmi. Tiket diterbitkan dan trip dilayani oleh operator yang dipilih.
          </p>

          <h2>2. Pemesanan & Pembayaran</h2>
          <p>
            Pemesanan dilakukan melalui website ini. Setelah Anda mengisi form pemesanan, kami akan
            mengirim instruksi pembayaran melalui WhatsApp.
          </p>
          <ul>
            <li>Metode pembayaran: <strong>transfer bank</strong> ke rekening yang kami informasikan</li>
            <li>Konfirmasi pembayaran dilakukan dengan mengirim bukti transfer via WhatsApp ke +62 878 2177 5082</li>
            <li>E-ticket akan dikirim setelah pembayaran terverifikasi (maksimal 30 menit pada jam operasional 07:00–22:00 WITA)</li>
            <li>Harga sudah termasuk asuransi penumpang. <strong>Tidak</strong> termasuk Harbour Tax Rp 20.000/pax (dibayar tunai di pelabuhan atau opsional via aplikasi)</li>
          </ul>

          <h2>3. E-Ticket & Boarding</h2>
          <ul>
            <li>E-ticket dikirim via email dan/atau WhatsApp dalam bentuk PDF</li>
            <li>Tunjukkan e-ticket di counter check-in pelabuhan</li>
            <li>Bawa identitas asli (KTP/Paspor) yang sesuai dengan data pemesanan</li>
            <li>Check-in <strong>minimal 30 menit</strong> sebelum jadwal keberangkatan</li>
            <li>Setiap penumpang berhak atas bagasi maksimal 20 kg</li>
          </ul>

          <h2>4. Perubahan Jadwal & Pembatalan oleh Operator</h2>
          <p>
            Jadwal dapat berubah karena kondisi cuaca, kondisi laut, atau alasan teknis di luar kendali
            kami. Dalam kondisi tersebut:
          </p>
          <ul>
            <li>Anda dapat memilih reschedule ke jadwal lain tanpa biaya tambahan, atau</li>
            <li>Refund penuh 100% sesuai Kebijakan Pengembalian Dana</li>
          </ul>

          <h2>5. Pembatalan oleh Penumpang</h2>
          <p>
            Untuk pembatalan dan refund, silakan baca <a href="/refund">Kebijakan Pengembalian Dana</a>.
          </p>

          <h2>6. Tanggung Jawab</h2>
          <p>
            Operator bertanggung jawab penuh atas keselamatan perjalanan, kondisi kapal, dan kru.
            tapToGo bertanggung jawab atas proses pemesanan, pembayaran, dan e-ticket. Kami{" "}
            <strong>tidak bertanggung jawab</strong> atas:
          </p>
          <ul>
            <li>Keterlambatan keberangkatan akibat cuaca atau alasan operasional operator</li>
            <li>Kehilangan barang pribadi selama perjalanan</li>
            <li>Penumpang yang tidak hadir atau terlambat check-in</li>
          </ul>

          <h2>7. Force Majeure</h2>
          <p>
            Bencana alam, cuaca ekstrem, gelombang tinggi, larangan otoritas pelabuhan, atau kondisi
            di luar kendali manusia membebaskan kedua belah pihak dari kewajiban. Refund mengikuti
            kebijakan operator.
          </p>

          <h2>8. Hukum yang Berlaku</h2>
          <p>
            Syarat & Ketentuan ini tunduk pada hukum Republik Indonesia. Sengketa akan diselesaikan
            secara musyawarah, atau melalui pengadilan di wilayah Lombok Utara.
          </p>

          <h2>9. Perubahan Ketentuan</h2>
          <p>
            Kami dapat memperbarui Syarat & Ketentuan ini sewaktu-waktu. Versi terbaru selalu tersedia
            di halaman ini. Tanggal pembaruan tercantum di bagian atas.
          </p>

          <h2>10. Kontak</h2>
          <p>
            Pertanyaan terkait Syarat & Ketentuan ini, hubungi kami:
          </p>
          <ul>
            <li>WhatsApp: <a href="https://wa.me/6287821775082">+62 878 2177 5082</a></li>
            <li>Website: <a href="https://taptogo.id">taptogo.id</a></li>
          </ul>
        </>
      ) : (
        <>
          <h2>1. About tapToGo</h2>
          <p>
            tapToGo (taptogo.id) is a fastboat ticket booking platform for Lombok–Bali routes.
            We act as a <strong>booking agent</strong> connecting passengers with official fastboat
            operators. Tickets are issued and trips operated by the chosen operator.
          </p>

          <h2>2. Booking & Payment</h2>
          <p>
            Bookings are made through this website. After you submit the booking form, we will send
            payment instructions via WhatsApp.
          </p>
          <ul>
            <li>Payment method: <strong>bank transfer</strong> to the account we provide</li>
            <li>Confirm payment by sending the transfer proof via WhatsApp to +62 878 2177 5082</li>
            <li>The e-ticket will be sent after payment is verified (within 30 minutes during operating hours 07:00–22:00 WITA)</li>
            <li>Prices include passenger insurance. <strong>Does not</strong> include Harbour Tax Rp 20,000/pax (paid in cash at the port, or optionally via the app)</li>
          </ul>

          <h2>3. E-Ticket & Boarding</h2>
          <ul>
            <li>E-ticket is sent via email and/or WhatsApp as a PDF</li>
            <li>Show the e-ticket at the port check-in counter</li>
            <li>Bring original ID (KTP/Passport) matching the booking data</li>
            <li>Check in <strong>at least 30 minutes</strong> before scheduled departure</li>
            <li>Each passenger is entitled to a max 20 kg of luggage</li>
          </ul>

          <h2>4. Schedule Changes & Operator-side Cancellations</h2>
          <p>
            Schedules may change due to weather, sea conditions, or technical reasons beyond our
            control. In such cases:
          </p>
          <ul>
            <li>You may reschedule to another departure at no extra cost, or</li>
            <li>Receive a 100% refund per our Refund Policy</li>
          </ul>

          <h2>5. Passenger-initiated Cancellations</h2>
          <p>
            For cancellation and refund details, please read our{" "}
            <a href="/refund">Refund Policy</a>.
          </p>

          <h2>6. Liability</h2>
          <p>
            The operator is fully responsible for trip safety, vessel condition, and crew. tapToGo is
            responsible for the booking process, payment, and e-ticket delivery. We are{" "}
            <strong>not responsible</strong> for:
          </p>
          <ul>
            <li>Departure delays due to weather or operational reasons</li>
            <li>Loss of personal belongings during the trip</li>
            <li>Passengers who do not show up or check in late</li>
          </ul>

          <h2>7. Force Majeure</h2>
          <p>
            Natural disasters, extreme weather, high waves, port authority restrictions, or other
            uncontrollable events release both parties from obligations. Refunds follow the operator&apos;s
            policy.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the Republic of Indonesia. Disputes will be
            resolved amicably first, or through courts in the North Lombok jurisdiction.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. The latest version is always available on this
            page. The update date is shown at the top.
          </p>

          <h2>10. Contact</h2>
          <p>For any questions about these Terms, contact us:</p>
          <ul>
            <li>WhatsApp: <a href="https://wa.me/6287821775082">+62 878 2177 5082</a></li>
            <li>Website: <a href="https://taptogo.id">taptogo.id</a></li>
          </ul>
        </>
      )}
    </LegalLayout>
  );
}
