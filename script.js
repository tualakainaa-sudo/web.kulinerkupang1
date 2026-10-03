const foodDetails = {
  sei: {
    title: "Se'i Sapi",
    category: "Makanan khas",
    description: "Se'i merupakan daging yang diolah melalui proses pengasapan. Se'i sapi dikenal luas sebagai salah satu kuliner yang berkaitan dengan Nusa Tenggara Timur. Cara penyajian, bumbu, dan rasa dapat berbeda antara penjual.",
    tip: "Untuk katalog UMKM, tambahkan nama usaha, alamat yang sudah diverifikasi, kisaran harga terbaru, jam buka, dan foto milik sendiri."
  },
  jagung: {
    title: "Jagung Bose",
    category: "Hidangan tradisional",
    description: "Jagung bose adalah hidangan berbahan dasar jagung yang dimasak bersama kacang-kacangan. Hidangan ini dikenal dalam tradisi kuliner masyarakat Nusa Tenggara Timur. Bahan dan cara memasak dapat bervariasi.",
    tip: "Kamu dapat menambahkan cerita dari keluarga atau penjual setempat agar informasi budaya lebih akurat."
  },
  sambal: {
    title: "Sambal Lu'at",
    category: "Pelengkap makanan",
    description: "Sambal lu'at merupakan sambal segar yang dapat disajikan sebagai pelengkap hidangan. Resep, bahan, dan tingkat kepedasan dapat berbeda sesuai kebiasaan rumah tangga atau penjual.",
    tip: "Cantumkan komposisi dan informasi alergi apabila data tersebut telah dikonfirmasi oleh penjual."
  },
  katemak: {
    title: "Katemak",
    category: "Hidangan rumahan",
    description: "Katemak adalah salah satu hidangan yang dikenal dalam kuliner Nusa Tenggara Timur. Bahan yang digunakan dapat mencakup jagung, kacang-kacangan, dan sayuran, dengan variasi resep menurut daerah atau keluarga.",
    tip: "Periksa nama lokal, bahan, dan penjelasan hidangan bersama sumber setempat sebelum dipublikasikan."
  }
};

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const searchInput = document.getElementById("searchInput");
const foodCards = [...document.querySelectorAll(".food-card")];
const emptyState = document.getElementById("emptyState");
const searchStatus = document.getElementById("searchStatus");
const dialog = document.getElementById("foodDialog");
const dialogTitle = document.getElementById("dialogTitle");
const dialogContent = document.getElementById("dialogContent");
const audioStatus = document.getElementById("audioStatus");
let currentDetailText = "";

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Tutup menu navigasi" : "Buka menu navigasi");
  menuToggle.textContent = isOpen ? "×" : "☰";
});

mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka menu navigasi");
    menuToggle.textContent = "☰";
  });
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLocaleLowerCase("id");
  let visibleCount = 0;
  foodCards.forEach(card => {
    const searchableText = (card.dataset.search + " " + card.innerText).toLocaleLowerCase("id");
    const matches = searchableText.includes(query);
    card.hidden = !matches;
    if (matches) visibleCount++;
  });
  emptyState.hidden = visibleCount !== 0;
  searchStatus.textContent = query ? `${visibleCount} kuliner ditemukan.` : "";
});

document.querySelectorAll(".detail-button").forEach(button => {
  button.addEventListener("click", () => {
    const food = foodDetails[button.dataset.food];
    if (!food) return;
    dialogTitle.textContent = food.title;
    currentDetailText = `${food.title}. ${food.description}`;
    dialogContent.replaceChildren();

    const category = document.createElement("p");
    category.className = "eyebrow";
    category.textContent = food.category.toUpperCase();

    const description = document.createElement("p");
    description.textContent = food.description;

    const tip = document.createElement("p");
    tip.className = "small-note";
    tip.textContent = food.tip;

    dialogContent.append(category, description, tip);
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      alert(`${food.title}\n\n${food.description}`);
    }
  });
});

document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
document.getElementById("dialogLocationLink").addEventListener("click", () => dialog.close());

function speakText(text) {
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    audioStatus.textContent = "Browser ini belum mendukung text-to-speech. Gunakan transkrip teks atau tambahkan file audio rekaman.";
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.9;
  utterance.onstart = () => { audioStatus.textContent = "Audio sedang diputar."; };
  utterance.onend = () => { audioStatus.textContent = "Audio selesai diputar."; };
  utterance.onerror = () => { audioStatus.textContent = "Audio tidak dapat diputar. Coba gunakan browser lain."; };
  window.speechSynthesis.speak(utterance);
}

document.getElementById("speakButton").addEventListener("click", () => {
  const text = document.getElementById("audioTranscript").textContent;
  speakText(text);
});
document.getElementById("speakDetailButton").addEventListener("click", () => {
  if (currentDetailText) speakText(currentDetailText);
});
document.getElementById("stopSpeakButton").addEventListener("click", () => {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  audioStatus.textContent = "Audio dihentikan.";
});

// Breadcrumb mengikuti bagian halaman yang sedang terlihat.
const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");
const sections = [...document.querySelectorAll("main section[id]")];
const sectionNames = {
  beranda: "Beranda",
  profil: "Profil Kuliner",
  kuliner: "Kuliner",
  galeri: "Galeri",
  audio: "Audio",
  lokasi: "Lokasi",
  sitemap: "Sitemap",
  tentang: "Tentang"
};

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    breadcrumbCurrent.textContent = sectionNames[visible.target.id] || visible.target.id;
    document.querySelectorAll(".main-nav a").forEach(link => {
      const active = link.getAttribute("href") === `#${visible.target.id}`;
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
      link.classList.toggle("active", active);
    });
  }, { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.15, 0.4] });
  sections.forEach(section => observer.observe(section));
}
