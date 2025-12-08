// Buka popup ketika link diklik
document.getElementById("openPopup").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("popup-modal").style.display = "block";
});

// Tombol close
document.querySelector(".close").onclick = function () {
    document.getElementById("popup-modal").style.display = "none";
};

// Klik luar untuk nutup popup
window.onclick = function (e) {
    if (e.target == document.getElementById("popup-modal")) {
        document.getElementById("popup-modal").style.display = "none";
    }
};
