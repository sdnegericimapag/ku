const username = "sdnegericimapag";
const repo = "ku";
const folder = "artikel";

const listElement = document.getElementById("artikel-list");
const viewElement = document.getElementById("artikel-view");

// ============================
// CEK FILE ADA ATAU TIDAK
// ============================
async function fileExists(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

// ============================
// AMBIL SNIPPET DARI ISI ARTIKEL
// ============================
async function getSnippet(path) {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/main/${path}`);
    if (!res.ok) return "Klik untuk membaca isi artikel lengkap...";
    const html = await res.text();
    // Buang semua tag HTML
    const plain = html.replace(/<[^>]+>/g, "");
    // Ambil 150 karakter pertama
    return plain.substring(0, 150) + "...";
  } catch {
    return "Klik untuk membaca isi artikel lengkap...";
  }
}

// ============================
// TAMPILKAN LIST ARTIKEL
// ============================
function loadArticleList() {
  listElement.style.display = "block";
  viewElement.style.display = "none";

  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder}`)
    .then(res => res.json())
    .then(files => {
      const htmlFiles = files.filter(f => f.name.endsWith(".html"));
      htmlFiles.sort((a, b) => b.name.localeCompare(a.name));

      listElement.innerHTML = "";

      htmlFiles.forEach(async file => {
        const namaFile = file.name.replace(".html", "");
        const tanggal = namaFile.substring(0, 10);
        const judul = namaFile.substring(11).replace(/-/g, " ");
        const thumbName = namaFile + ".jpg";

        // Ambil snippet dari isi artikel
        const snippet = await getSnippet(file.path);

        // Buat kartu artikel
        const card = document.createElement("div");
        card.className = "artikel-card";
        card.innerHTML = `
          <img class="artikel-thumb" src="artikel/thumb/${thumbName}" alt="">
          <div class="artikel-info">
            <div class="artikel-title">${judul}</div>
            <div class="artikel-date">${tanggal}</div>
            <div class="artikel-snippet">${snippet}</div>
            <a href="javascript:void(0)" class="artikel-more"
               onclick="loadArticle('${file.path}', event)">Selengkapnya →</a>
            <div class="download-links"></div>
          </div>
        `;

        const downloadContainer = card.querySelector(".download-links");

        // Cek PDF, DOCX, XLSX
        const ekstensi = ["pdf", "docx", "xlsx"];
        ekstensi.forEach(async ext => {
          const url = `https://raw.githubusercontent.com/${username}/${repo}/main/${folder}/${namaFile}.${ext}`;
          if (await fileExists(url)) {
            const dl = document.createElement("a");
            dl.href = url;
            dl.className = "artikel-download";
            dl.download = "";
            dl.textContent = `⬇ Download ${ext.toUpperCase()}`;
            downloadContainer.appendChild(dl);
          }
        });

        listElement.appendChild(card);
      });
    });
}

// =====================================
// BACA ARTIKEL DI DALAM HALAMAN
// =====================================
function loadArticle(path, evt) {
  if (evt && evt.preventDefault) evt.preventDefault();

  const rawUrl = `https://raw.githubusercontent.com/${username}/${repo}/main/${path}`;

  fetch(rawUrl)
    .then(res => res.text())
    .then(html => {
      listElement.style.display = "none";
      viewElement.style.display = "block";

      viewElement.innerHTML = `
        <div class="artikel-full">
          ${html}
          <br><br>
          <button class="btn-kembali" onclick="loadArticleList()">⬅ Kembali ke Berita</button>
        </div>
      `;
      viewElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

loadArticleList();


