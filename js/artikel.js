const username = "sdnegericimapag";
const repo = "ku";
const folder = "artikel";

const listContainer = document.getElementById("daftar-artikel");
const articleView = document.getElementById("artikel-view");

// ----------- TAMPILKAN DAFTAR ARTIKEL -----------
function loadArticleList() {
  articleView.style.display = "none";
  listContainer.style.display = "block";

  fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder}`)
    .then(res => res.json())
    .then(files => {
      const artikelFiles = files.filter(f => f.name.endsWith(".html"));

      artikelFiles.sort((a, b) => b.name.localeCompare(a.name));

      listContainer.innerHTML = "";

      artikelFiles.forEach(file => {
        const namaFile = file.name.replace(".html", "");
        const judul = namaFile.substring(11).replace(/-/g, " ");
        const tanggal = namaFile.substring(0, 10);

        listContainer.innerHTML += `
          <div class="artikel-card">
            <h3>${judul}</h3>
            <div class="tanggal">${tanggal}</div>
            <button class="btn-baca" onclick="loadArticle('${file.path}')">Baca Artikel</button>
          </div>
        `;
      });
    });
}

// ----------- BACA ARTIKEL DI DALAM HALAMAN -----------
function loadArticle(path) {

  fetch(`https://raw.githubusercontent.com/${username}/${repo}/main/${path}`)
    .then(res => res.text())
    .then(html => {

      listContainer.style.display = "none";
      articleView.style.display = "block";

      articleView.innerHTML = `
        <div class="artikel-full">
          ${html}
          <br><br>
          <button class="btn-kembali" onclick="loadArticleList()">⬅ Kembali ke Berita</button>
        </div>
      `;
    });
}

loadArticleList();
