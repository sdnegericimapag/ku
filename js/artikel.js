// js/artikel.js (GANTI SELURUH FILE DENGAN INI)

const username = "sdnegericimapag";
const repo = "ku";
const folder = "artikel";

const listElement = document.getElementById("artikel-list");
const viewElement = document.getElementById("artikel-view");

// base untuk mengambil file mentah dari repo
const RAW_BASE = `https://raw.githubusercontent.com/${username}/${repo}/main/`;

// ============================
// TAMPILKAN LIST ARTIKEL
// ============================
function loadArticleList() {
  listElement.style.display = "block";
  viewElement.style.display = "none";

  fetch(`${RAW_BASE}${folder}`)
    .then(res => res.json())
    .then(files => {

      const htmlFiles = files.filter(f => f.name.endsWith(".html"));
      htmlFiles.sort((a, b) => b.name.localeCompare(a.name));

      listElement.innerHTML = "";

      htmlFiles.forEach(file => {
        const namaFile = file.name.replace(".html", "");
        const tanggal = namaFile.substring(0, 10);
        const judul = namaFile.substring(11).replace(/-/g, " ");

        const thumbName = namaFile + ".jpg";
        const snippet = "Klik untuk membaca isi artikel lengkap...";

        // NOTE: gunakan href="javascript:void(0)" supaya tidak memaksa scroll ke atas
        // dan panggil loadArticle dengan path file.path
        listElement.innerHTML += `
          <div class="artikel-card">
            <img class="artikel-thumb" src="artikel/thumb/${thumbName}" alt="">
            <div class="artikel-info">
              <div class="artikel-title">${judul}</div>
              <div class="artikel-date">${tanggal}</div>
              <div class="artikel-snippet">${snippet}</div>
              <a href="javascript:void(0)" class="artikel-more"
                 onclick="loadArticle('${file.path.replace(/'/g, "\\'")}')">Selengkapnya →</a>
            </div>
          </div>
        `;
      });

    })
    .catch(err => {
      console.error("Gagal mengambil daftar artikel:", err);
      listElement.innerHTML = "<p>Gagal memuat daftar artikel.</p>";
    });
}

// ============================
// BACA ARTIKEL PENUH
// ============================
function loadArticle(path) {

  fetch(`${RAW_BASE}${path}`)
    .then(res => {
      if (!res.ok) throw new Error("Gagal memuat file artikel");
      return res.text();
    })
    .then(html => {

      // sembunyikan list, tampilkan view
      listElement.style.display = "none";
      viewElement.style.display = "block";

      // --- PERBAIKI PATH GAMBAR DI DALAM HTML ARTIKEL ---
      // Jika artikel menggunakan path relatif (mis. "img/foo.jpg" atau "./img/foo.jpg" atau "artikel/foo.jpg")
      // kita ubah menjadi URL absolut ke raw.githubusercontent agar gambar dapat dimuat.
      // Tidak mengubah src yang sudah absolute (http / https / data:)
      html = html.replace(/src=(["'])(?!https?:|data:)(.+?)\1/gi, function(match, quote, srcPath) {
        // bersihkan ./ atau leading slash
        const clean = srcPath.replace(/^\.\//, "").replace(/^\/+/, "");
        return `src=${quote}${RAW_BASE}${clean}${quote}`;
      });

      // --- MASUKKAN KE viewElement TANPA MERUSAK LAYOUT ASLI ---
      // Bungkus minimal agar tetap di dalam kotak artikel Anda
      viewElement.innerHTML = `
        <div class="artikel-template-body">
          ${html}
        </div>
        <br>
        <a href="javascript:void(0)" onclick="loadArticleList()" 
           style="font-weight:bold;color:#0077cc">← Kembali</a>
      `;
    })
    .catch(err => {
      console.error("Gagal memuat artikel:", err);
      viewElement.style.display = "block";
      viewElement.innerHTML = "<p>Gagal memuat artikel.</p><br><a href=\"javascript:void(0)\" onclick=\"loadArticleList()\">← Kembali</a>";
    });
}

// mulai
loadArticleList();
