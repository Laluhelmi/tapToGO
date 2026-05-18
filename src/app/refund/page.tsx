"use client";
import LegalLayout from "@/components/LegalLayout";
import { useLang } from "@/contexts/LanguageContext";

export default function RefundPage() {
  const { lang } = useLang();
  const isID = lang === "id";

  return (
    <LegalLayout
      title={isID ? "Kebijakan Pengembalian Dana" : "Refund Policy"}
      lastUpdated="19 May 2026">
      {isID ? (
        <>
          <h2>1. Ringkasan</h2>
          <p>
            Kami memahami rencana perjalanan bisa berubah. Kebijakan ini menjelaskan kondisi
            pembatalan dan jumlah refund yang berlaku.
          </p>

          <h2>2. Pembatalan oleh Penumpang</h2>
          <p>Besaran refund tergantung waktu pembatalan dihitung mundur dari jadwal keberangkatan:</p>
          <ul>
            <li><strong>Lebih dari 48 jam sebelum keberangkatan</strong> → refund <strong>80%</strong> dari harga tiket</li>
            <li><strong>24–48 jam sebelum keberangkatan</strong> → refund <strong>50%</strong></li>
            <li><strong>12–24 jam sebelum keberangkatan</strong> → refund <strong>25%</strong></li>
            <li><strong>Kurang dari 12 jam atau no-show</strong> → <strong>tidak ada refund</strong></li>
          </ul>
          <p>
            Selisih dari 100% dipakai untuk biaya admin, biaya transaksi, dan kompensasi operator yang
            telah memblok seat.
          </p>

          <h2>3. Pembatalan oleh Operator</h2>
          <p>Jika operator membatalkan trip (cuaca buruk, kerusakan kapal, larangan otoritas pelabuhan):</p>
          <ul>
            <li><strong>Refund 100%</strong> ke metode pembayaran asal, atau</li>
            <li><strong>Reschedule gratis</strong> ke jadwal lain (subject to availability)</li>
          </ul>

          <h2>4. Perubahan Jadwal (Reschedule)</h2>
          <ul>
            <li>Gratis jika dilakukan minimal <strong>24 jam</strong> sebelum keberangkatan, subject to availability</li>
            <li>Kurang dari 24 jam: dikenakan biaya admin Rp 50.000/booking, subject to availability</li>
            <li>Perubahan nama penumpang: gratis, paling lambat 24 jam sebelum keberangkatan</li>
          </ul>

          <h2>5. Harbour Tax</h2>
          <p>
            Jika Anda memilih membayar Harbour Tax via aplikasi dan trip dibatalkan operator, biaya
            Harbour Tax juga akan direfund 100%. Jika Anda membatalkan sendiri, biaya Harbour Tax
            akan direfund 100% selama pembatalan dilakukan minimal 12 jam sebelum keberangkatan.
          </p>

          <h2>6. Cara Mengajukan Refund</h2>
          <ol style={{ listStyle: "decimal", marginLeft: "1.25rem" }}>
            <li>Hubungi kami via WhatsApp <a href="https://wa.me/6287821775082">+62 878 2177 5082</a></li>
            <li>Sertakan <strong>Kode Booking</strong> dan alasan pembatalan</li>
            <li>Kami akan konfirmasi jumlah refund dalam maksimal 24 jam</li>
            <li>Refund akan diproses dalam <strong>3–7 hari kerja</strong> ke rekening pengirim transfer awal</li>
          </ol>

          <h2>7. Catatan Penting</h2>
          <ul>
            <li>Refund <strong>tidak berlaku</strong> untuk penumpang yang tidak hadir atau terlambat check-in</li>
            <li>Refund <strong>tidak berlaku</strong> untuk perjalanan yang sudah dimulai</li>
            <li>Biaya transaksi bank (jika ada) ditanggung pelanggan</li>
            <li>Untuk grup booking (5+ orang), kebijakan khusus dapat berlaku — hubungi kami</li>
          </ul>

          <h2>8. Sengketa</h2>
          <p>
            Jika ada perselisihan terkait refund, kami akan menyelesaikannya secara musyawarah dalam
            14 hari kerja. Jika tidak tercapai kesepakatan, akan dilanjutkan sesuai{" "}
            <a href="/terms">Syarat & Ketentuan</a>.
          </p>

          <h2>9. Kontak</h2>
          <ul>
            <li>WhatsApp: <a href="https://wa.me/6287821775082">+62 878 2177 5082</a></li>
            <li>Jam operasional: 07:00–22:00 WITA setiap hari</li>
          </ul>
        </>
      ) : (
        <>
          <h2>1. Summary</h2>
          <p>
            We understand travel plans can change. This policy explains cancellation conditions and
            applicable refund amounts.
          </p>

          <h2>2. Passenger-initiated Cancellation</h2>
          <p>Refund amounts depend on when you cancel, counted from the scheduled departure:</p>
          <ul>
            <li><strong>More than 48 hours before departure</strong> → <strong>80% refund</strong> of ticket price</li>
            <li><strong>24–48 hours before departure</strong> → <strong>50% refund</strong></li>
            <li><strong>12–24 hours before departure</strong> → <strong>25% refund</strong></li>
            <li><strong>Less than 12 hours or no-show</strong> → <strong>no refund</strong></li>
          </ul>
          <p>
            The difference from 100% covers admin fees, transaction costs, and operator compensation
            for the blocked seat.
          </p>

          <h2>3. Operator-initiated Cancellation</h2>
          <p>If the operator cancels the trip (bad weather, vessel issues, port authority restrictions):</p>
          <ul>
            <li><strong>100% refund</strong> to the original payment method, or</li>
            <li><strong>Free reschedule</strong> to another departure (subject to availability)</li>
          </ul>

          <h2>4. Reschedule</h2>
          <ul>
            <li>Free if requested at least <strong>24 hours</strong> before departure, subject to availability</li>
            <li>Less than 24 hours: Rp 50,000/booking admin fee, subject to availability</li>
            <li>Passenger name change: free, latest 24 hours before departure</li>
          </ul>

          <h2>5. Harbour Tax</h2>
          <p>
            If you chose to pay Harbour Tax via the app and the operator cancels, the Harbour Tax is
            also refunded 100%. If you cancel yourself, Harbour Tax is refunded 100% as long as
            cancellation happens at least 12 hours before departure.
          </p>

          <h2>6. How to Request a Refund</h2>
          <ol style={{ listStyle: "decimal", marginLeft: "1.25rem" }}>
            <li>Contact us via WhatsApp <a href="https://wa.me/6287821775082">+62 878 2177 5082</a></li>
            <li>Include your <strong>Booking Code</strong> and reason for cancellation</li>
            <li>We will confirm the refund amount within 24 hours</li>
            <li>Refund is processed within <strong>3–7 business days</strong> to the original transfer account</li>
          </ol>

          <h2>7. Important Notes</h2>
          <ul>
            <li>No refund for passengers who don&apos;t show up or check in late</li>
            <li>No refund for trips that have already started</li>
            <li>Bank transaction fees (if any) are at the customer&apos;s expense</li>
            <li>Group bookings (5+ pax) may have specific terms — please contact us</li>
          </ul>

          <h2>8. Disputes</h2>
          <p>
            For any refund disputes, we will work to resolve them amicably within 14 business days.
            If no agreement is reached, the matter follows our{" "}
            <a href="/terms">Terms of Service</a>.
          </p>

          <h2>9. Contact</h2>
          <ul>
            <li>WhatsApp: <a href="https://wa.me/6287821775082">+62 878 2177 5082</a></li>
            <li>Operating hours: 07:00–22:00 WITA daily</li>
          </ul>
        </>
      )}
    </LegalLayout>
  );
}
