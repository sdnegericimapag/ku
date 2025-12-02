const username = "sdnegericimapag";
const repo = "ku";
const folder = "artikel";

const listElement = document.getElementById("artikel-list");
const viewElement = document.getElementById("artikel-view");

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
      // urutkan descending (nama file terbaru di atas)
      htmlFiles.sort((a, b) => b.name.localeCompare(a.name));

      listElement.innerHTML = "";

      htmlFiles.forEach(file => {
        const namaFile = file.name.replace(".html", "");
        const tanggal = namaFile.substring(0, 10);
        const judul = namaFile.substring(11).replace(/-/g, " ");
        const thumbName = namaFile + ".jpg";
        const snippet = "Klik untuk membaca isi artikel lengkap...";

        // gunakan insertAdjacentHTML agar cepat dan tidak reset event
        listElement.insertAdjacentHTML("beforeend", `
          <div class="artikel-card">
            <img class="artikel-thumb" src="artikel/thumb/${thumbName}" alt="">
            <div class="artikel-info">
              <div class="artikel-title">${judul}</div>
              <div class="artikel-date">${tanggal}</div>
              <div class="artikel-snippet">${snippet}</div>
              <a href="javascript:void(0)" class="artikel-more"
                 onclick="loadArticle('${file.path}', event)">Selengkapnya →</a>
            </div>
          </div>
        `);
      });
    })
    .catch(err => {
      console.error(err);
      listElement.innerHTML = `<p>Gagal memuat daftar artikel.</p>`;
    });
}

// =====================================
// BACA ARTIKEL DI DALAM HALAMAN
// =====================================
function loadArticle(path, evt) {
  // cegah scroll ke atas jika masih pakai anchor
  if (evt && evt.preventDefault) evt.preventDefault();

  // path dari API contents adalah relatif (mis. "artikel/2025-12-01-judul.html")
  const rawUrl = `https://raw.githubusercontent.com/${username}/${repo}/main/${path}`;

  fetch(rawUrl)
    .then(res => {
      if (!res.ok) throw new Error(`Gagal memuat artikel: ${res.status}`);
      return res.text();
    })
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
      // opsional: scroll ke atas konten view setelah dimuat
      viewElement.scrollIntoView({ behavior: "smooth", block: "start" });
    })
    .catch(err => {
      console.error(err);
      viewElement.style.display = "block";
      viewElement.innerHTML = `
        <p>Terjadi masalah saat memuat artikel.</p>
        <button class="btn-kembali" onclick="loadArticleList()">⬅ Kembali ke Berita</button>
      `;
    });
}

loadArticleList();
