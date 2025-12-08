// tampilkan popup otomatis saat halaman dibuka
window.addEventListener("load", function () {
    document.getElementById("popup-modal").style.display = "block";
});

// tombol close
document.querySelector(".close").onclick = function () {
    document.getElementById("popup-modal").style.display = "none";
};

// klik luar popup = tutup
window.onclick = function (e) {
    if (e.target == document.getElementById("popup-modal")) {
        document.getElementById("popup-modal").style.display = "none";
    }
};
