const username = "sdnegericimapag";
const repo = "ku";
const folder = "artikel";

const listElement = document.getElementById("artikel-list");
const viewElement = document.getElementById("artikel-view");

// Cek file ada atau tidak
async function fileExists(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

// Ambil snippet dari isi artikel
async function getSnippet(path) {
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${username}/${repo}/main/${path}`);
    if (!res.ok) return "Klik untuk membaca isi artikel lengkap...";
    const html = await res.text();
    const plain = html.replace(/<[^>]+>/g, "");
    return plain.substring(0, 150) + "...";
  } catch {
    return "Klik untuk membaca isi artikel lengkap...";
  }
}

// Tampilkan list artikel
function loadArticleList() {
  listElement.style.display = "block";
  viewElement.style.display = "none";

  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder}`)
    .then(res => res.json())
    .then(files => {
      const htmlFiles = files.filter(f => f.name.endsWith(".html"));
      // urutkan berdasarkan nama file (misalnya YYYY-MM-DD judul)
      htmlFiles.sort((a, b) => b.name.localeCompare(a.name));

      listElement.innerHTML = "";

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

        // Tambahkan link download jika ada
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
    });
}

// Baca artikel di dalam halaman
function loadArticle(path, evt) {
  if (evt && evt.preventDefault) evt.preventDefault();

  const rawUrl = `https://raw.githubusercontent.com/${username}/${repo}/main/${path}`;
  const namaFile = path.replace(`${folder}/`, "").replace(".html", "");

  fetch(rawUrl)
    .then(res => res.text())
    .then(async html => {
      listElement.style.display = "none";
      viewElement.style.display = "block";

      const container = document.createElement("div");
      container.className = "artikel-full";
      container.innerHTML = `
        ${html}
        <br><br>
        <button class="btn-kembali" onclick="loadArticleList(); document.getElementById('artikel-list').scrollIntoView({behavior:'smooth'});">⬅ Kembali ke Berita</button>
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
      // Fokus ke atas container artikel
      viewElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

// Jalankan pertama kali
loadArticleList();
