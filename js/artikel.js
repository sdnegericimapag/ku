// Folder tempat artikel disimpan
const folder = 'artikel/';

// Tempat menampilkan artikel
const container = document.getElementById('daftar-artikel');

// Daftar artikel (akan terisi otomatis)
let artikelList = [];

// Ambil daftar file dari GitHub (API public)
fetch(`https://api.github.com/repos/sdnegericimapag/ku/REPO/contents/${folder}`)
  .then(response => response.json())
  .then(files => {
    files.forEach(file => {
      if (file.name.endsWith(".html")) {
        artikelList.push(file.name);
      }
    });

    // Urutkan berdasarkan nama file (tanggal)
    artikelList.sort().reverse();

    // Tampilkan daftar
    artikelList.forEach(namaFile => {
      const tanggal = namaFile.substring(0, 10); // 2025-01-18
      const judul = namaFile.replace(".html", "").substring(11);

      container.innerHTML += `
        <div class="item-artikel">
          <h2>${judul.replace(/-/g, " ")}</h2>
          <small>${tanggal}</small><br>
          <a href="${folder}${namaFile}">Baca Artikel</a>
          <hr>
        </div>
      `;
    });
  })
  .catch(error => {
    container.innerHTML = "Gagal memuat artikel.";
  });
