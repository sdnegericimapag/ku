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
      htmlFiles.sort((a, b) => b.name.localeCompare(a.name));

      listElement.innerHTML = "";

      htmlFiles.forEach(file => {
        const namaFile = file.name.replace(".html", "");
        const tanggal = namaFile.substring(0, 10);
        const judul = namaFile.substring(11).replace(/-/g, " ");

        const thumbName = namaFile + ".jpg";

        const snippet = "Klik untuk membaca isi artikel lengkap...";

        listElement.innerHTML += `
          <div class="artikel-card">
            <img class="artikel-thumb" src="artikel/thumb/${thumbName}" alt="">
            <div class="artikel-info">
              <div class="artikel-title">${judul}</div>
              <div class="artikel-date">${tanggal}</div>
              <div class="artikel-snippet">${snippet}</div>
              <a href="#" class="artikel-more"
                 onclick="loadArticle('${file.path}')">Selengkapnya →</a>
            </div>
          </div>
        `;
      });

    });

}

// ============================
// BACA ARTIKEL PENUH
// ============================
function loadArticle(path) {

  fetch(`https://raw.githubusercontent.com/${username}/${repo}/main/${path}`)
    .then(res => res.text())
    .then(html => {

      // SEMBUNYIKAN LIST & TAMPILKAN VIEW
      listElement.style.display = "none";
      viewElement.style.display = "block";

      // PERBAIKI PATH GAMBAR
      html = html.replace(/src="artikel\/([^"]+)"/g, function(match, imgPath) {
        return `src="https://raw.githubusercontent.com/${username}/${repo}/main/artikel/${imgPath}"`;
      });

      // TAMPILKAN KE HALAMAN
      viewElement.innerHTML =
          html +
        `<br><a href="" onclick="event.preventDefault(); loadArticleList()" 
         style="font-weight:bold;color:#0077cc">← Kembali</a>`;
    });
}
