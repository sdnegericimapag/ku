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
    const plain = html.replace(/<[^>]+>/g, ""); // buang tag HTML
    return plain.substring(0, 150) + "...";
  } catch {
    return "Klik untuk membaca isi artikel lengkap...";
  }
}

function loadArticleList() {
  listElement.style.display = "block";
  viewElement.style.display = "none";

  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder}`)
    .then(res => res.json())
    .then(files => {
      const htmlFiles = files.filter(f => f.name.endsWith(".html"));

      // Urutkan berdasarkan tanggal di nama file (format YYYY-MM-DD)
      htmlFiles.sort((a, b) => {
        const dateA = new Date(a.name.substring(0, 10));
        const dateB = new Date(b.name.substring(0, 10));
        return dateB - dateA; // terbaru duluan
      });

      listElement.innerHTML = "";
      listElement.scrollIntoView({ behavior: "smooth", block: "start" });

      // tampilkan semua artikel sebagai list
      htmlFiles.forEach(async file => {
        const namaFile = file.name.replace(".html", "");
        const tanggal = namaFile.substring(0, 10);
        const judul = namaFile.substring(11).replace(/-/g, " ");
        const thumbName = namaFile + ".jpg";

        const snippet = await getSnippet(file.path);

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
        const ekstensi = ["pdf", "docx", "xlsx"];

        for (const ext of ekstensi) {
          const url = `https://raw.githubusercontent.com/${username}/${repo}/main/${folder}/${namaFile}.${ext}`;
          if (await fileExists(url)) {
            const dl = document.createElement("a");
            dl.href = url;
            dl.className = "artikel-download";
            dl.download = "";
            dl.textContent = `⬇ Download ${ext.toUpperCase()}`;
            downloadContainer.appendChild(dl);
          }
        }

        listElement.appendChild(card);
      });

      // ⬇ Tambahkan ini: langsung buka artikel terbaru (file pertama)
      if (htmlFiles.length > 0) {
        loadArticle(htmlFiles[0].path);
      }
    });
}
// =====================================
// BACA ARTIKEL DI DALAM HALAMAN
// =====================================
function loadArticle(path, evt) {
  if (evt && evt.preventDefault) evt.preventDefault();

  const rawUrl = `https://raw.githubusercontent.com/${username}/${repo}/main/${path}`;
  const namaFile = path.replace(`${folder}/`, "").replace(".html", "");

  fetch(rawUrl)
    .then(res => res.text())
    .then(async html => {
      listElement.style.display = "none";
      viewElement.style.display = "block";

      // Buat container artikel
      const container = document.createElement("div");
      container.className = "artikel-full";
      container.innerHTML = `
        ${html}
        <br><br>
        <button class="btn-kembali" onclick="loadArticleList()">⬅ Kembali ke Berita</button>
        <div class="download-links"></div>
      `;

      // Tambahkan link download
      const downloadContainer = container.querySelector(".download-links");
      const ekstensi = ["pdf", "docx", "xlsx"];
      for (const ext of ekstensi) {
        const url = `https://raw.githubusercontent.com/${username}/${repo}/main/${folder}/${namaFile}.${ext}`;
        if (await fileExists(url)) {
          const dl = document.createElement("a");
          dl.href = url;
          dl.className = "artikel-download";
          dl.download = "";
          dl.textContent = `⬇ Download ${ext.toUpperCase()}`;
          downloadContainer.appendChild(dl);
        }
      }

      viewElement.innerHTML = "";
      viewElement.appendChild(container);
      viewElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}
loadArticleList();

