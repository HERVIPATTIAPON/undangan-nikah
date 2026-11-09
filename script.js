
// ==========================================
// DATA UNDANGAN PERNIKAHAN
// ==========================================

const weddingConfig = {
  date: "2026-11-23T14:00:00+09:00",
  dateText: "SENIN, 23 NOVEMBER 2026",

  ceremonyTime: "14:00 WIT",
  ceremonyPlace: "Gereja Syaloom JEMAAT GPM URSANA, KM.6",

  receptionTime: "17:00 WIT",
  receptionPlace: "KEL. Bpk. Alm R. Silaka[ Depan Gereja Syaloom Jemaat GPM Ursana ]",

  mapUrl: "https://maps.app.goo.gl/xi5SUj6sgkRbWioK8",

  bankName: "MANDIRI",
  accountNumber: "[1860006420604]",
  accountOwner: "[Yosepina. A Niak]",

  whatsappNumber: "628xxxxxxxxxx"
};


// ==========================================
// FUNGSI MEMANGGIL ELEMEN HTML
// ==========================================

const byId = id => document.getElementById(id);

function setText(id, value) {
  const element = byId(id);
  if (element) element.textContent = value;
}


// ==========================================
// JAM DIGITAL OTOMATIS WIT
// ==========================================

function updateDigitalClock() {

  const now = new Date();

  const time = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jayapura",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);

  const date = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jayapura",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(now);

  setText("digitalClock", time + " WIT");
  setText("digitalDate", date.toUpperCase());
}

updateDigitalClock();
setInterval(updateDigitalClock, 1000);


// ==========================================
// MEMASUKKAN DATA UNDANGAN KE HTML
// ==========================================

setText("hero-date", weddingConfig.dateText);
setText("ceremony-date", weddingConfig.dateText);
setText("reception-date", weddingConfig.dateText);

setText("ceremony-time", "Pukul " + weddingConfig.ceremonyTime);
setText("reception-time", "Pukul " + weddingConfig.receptionTime);

setText("ceremony-place", weddingConfig.ceremonyPlace);
setText("reception-place", weddingConfig.receptionPlace);

setText("account-number", weddingConfig.accountNumber);

const mapLink = byId("map-link");
if (mapLink) {
  mapLink.href = weddingConfig.mapUrl;
}


// ==========================================
// COUNTDOWN OTOMATIS PERNIKAHAN
// ==========================================

function updateCountdown() {

  const target = new Date(weddingConfig.date).getTime();
  const distance = target - Date.now();

  const ids = ["days", "hours", "minutes", "seconds"];

  if (distance <= 0) {
    ids.forEach(id => setText(id, "00"));
    setText("countdown-status", "HARI BAHAGIA TELAH TIBA!");
    return;
  }

  setText("countdown-status", "MENUJU HARI BAHAGIA");

  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  const seconds = Math.floor((distance % 60000) / 1000);

  setText("days", String(days).padStart(2, "0"));
  setText("hours", String(hours).padStart(2, "0"));
  setText("minutes", String(minutes).padStart(2, "0"));
  setText("seconds", String(seconds).padStart(2, "0"));
}

updateCountdown();
setInterval(updateCountdown, 1000);


// ==========================================
// SALIN NOMOR REKENING
// ==========================================

const copyButton = byId("copy-account");

if (copyButton) {
  copyButton.addEventListener("click", async () => {

    try {
      await navigator.clipboard.writeText(
        weddingConfig.accountNumber
      );

      copyButton.textContent = "Nomor rekening tersalin!";

    } catch {
      alert(
        "Silakan salin nomor rekening secara manual: " +
        weddingConfig.accountNumber
      );
    }

  });
}


// ==========================================
// MUSIK PERNIKAHAN
// ==========================================

const music = byId("wedding-music");
const musicButton = byId("music-toggle");

if (music && musicButton) {

  musicButton.addEventListener("click", async () => {

    if (music.paused) {

      try {
        await music.play();
        setText("music-label", "Jeda Musik");

      } catch {
        alert(
          "Musik belum dapat diputar. Periksa file audio Anda."
        );
      }

    } else {

      music.pause();
      setText("music-label", "Putar Musik");

    }

  });

}


// ==========================================
// RSVP PERNIKAHAN
// ==========================================

const form = byId("rsvp-form");

if (form) {

  form.addEventListener("submit", event => {

    event.preventDefault();

    const data = new FormData(form);

    const nama = String(data.get("nama") || "").trim();
    const jumlah = data.get("jumlah") || "-";
    const status = data.get("status") || "-";
    const ucapan = String(data.get("ucapan") || "").trim();

    if (!nama) {
      alert("Silakan masukkan nama Anda.");
      return;
    }

    // Menampilkan ucapan tamu
    if (ucapan) {

      const guestList = byId("guest-list");

      if (guestList) {

        const entry = document.createElement("div");
        entry.className = "guest-entry";

        const title = document.createElement("strong");
        title.textContent = nama;

        const message = document.createElement("p");
        message.textContent = ucapan;

        entry.append(title, message);
        guestList.prepend(entry);

      }
    }

    // Pesan WhatsApp
    const message =
      `Konfirmasi Undangan Pernikahan\n` +
      `Nama: ${nama}\n` +
      `Jumlah: ${jumlah}\n` +
      `Kehadiran: ${status}\n` +
      `Ucapan: ${ucapan || "-"}`;

    const phone = weddingConfig.whatsappNumber.replace(/\D/g, "");

    if (phone && !phone.includes("xxxxxxxxxx")) {

      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

    } else {

      alert(
        "RSVP berhasil disiapkan. Isi nomor WhatsApp tujuan pada weddingConfig."
      );

    }

    form.reset();

  });

}
