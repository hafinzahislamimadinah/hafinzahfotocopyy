/* Hafinzah Fotocopy — interactive frontend */

(function () {
  "use strict";

  /* ---------- Welcome overlay ---------- */
  const welcome = document.getElementById("welcomeOverlay");
  const welcomeEnter = document.getElementById("welcomeEnter");
  const WELCOME_KEY = "hf_welcome_seen";

  if (welcome) {
    if (sessionStorage.getItem(WELCOME_KEY) === "1") {
      welcome.classList.add("hide");
    }
    welcomeEnter?.addEventListener("click", function () {
      welcome.classList.add("hide");
      sessionStorage.setItem(WELCOME_KEY, "1");
    });
  }

  /* ---------- Mobile menu ---------- */
  const header = document.getElementById("header");
  const menuButton = document.getElementById("menuButton");
  menuButton?.addEventListener("click", function () {
    header.classList.toggle("mobile-open");
    const icon = menuButton.querySelector("i");
    if (header.classList.contains("mobile-open")) {
      icon.classList.replace("fa-bars", "fa-xmark");
    } else {
      icon.classList.replace("fa-xmark", "fa-bars");
    }
  });
  document.querySelectorAll(".navbar a").forEach(function (link) {
    link.addEventListener("click", function () {
      header.classList.remove("mobile-open");
      const icon = menuButton?.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    });
  });

  /* ---------- Header scroll + dual reveal ---------- */
  const backTop = document.getElementById("backTop");
  window.addEventListener("scroll", function () {
    const y = window.scrollY;
    header?.classList.toggle("scrolled", y > 20);
    backTop?.classList.toggle("show", y > 500);
  });
  backTop?.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Reveal on scroll (IntersectionObserver) + slight parallax feel on second pass
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  reveals.forEach(function (el) {
    io.observe(el);
  });

  // Second scroll effect: subtle parallax on hero visual
  const heroVisual = document.querySelector(".hero-visual");
  window.addEventListener("mousemove", function (e) {
    if (!heroVisual || window.innerWidth < 950) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 12;
    const y = (e.clientY / window.innerHeight - 0.5) * 12;
    heroVisual.style.transform = "translate(" + x + "px," + y + "px)";
  });

  /* ---------- Active nav ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a");
  function updateActiveNav() {
    let current = "home";
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - 140) current = section.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

  /* ---------- Smooth anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterIO = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = Number(el.getAttribute("data-count")) || 0;
        const suffix = end >= 1000 ? "K+" : end === 100 ? "%" : end <= 20 ? "+" : "";
        const displayEnd = end >= 1000 ? end / 1000 : end;
        let start = 0;
        const step = Math.max(displayEnd / 40, 0.2);
        const timer = setInterval(function () {
          start += step;
          if (start >= displayEnd) {
            start = displayEnd;
            clearInterval(timer);
          }
          el.textContent =
            end >= 1000
              ? Math.floor(start) + "K+"
              : end === 100
              ? Math.floor(start) + "%"
              : Math.floor(start) + (suffix === "+" ? "+" : "");
        }, 30);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach(function (c) {
    counterIO.observe(c);
  });

  /* ---------- Gallery data + filter + lightbox ---------- */
  const galleryData = [
    {
      id: 1,
      cat: "toko",
      title: "Tampak Depan Toko",
      desc: "Hafinzah Fotocopy di Jl. Raya Ciangsana, Gunung Putri, Bogor.",
      src: "images/toko-depan.jpg"
    },
    {
      id: 2,
      cat: "toko",
      title: "Suasana Malam",
      desc: "Toko buka dan siap melayani pelanggan.",
      src: "images/toko-malam.jpg"
    },
    {
      id: 3,
      cat: "toko",
      title: "Dalam Toko",
      desc: "Area print, ATK, dan pelayanan pelanggan.",
      src: "images/dalam-toko.jpg"
    },
    {
      id: 4,
      cat: "hasil",
      title: "Antrian Kasir",
      desc: "Pelayanan ramah untuk pelajar, mahasiswa, dan umum.",
      src: "images/kasir-pelanggan.jpg"
    },
    {
      id: 5,
      cat: "hasil",
      title: "Tumpukan Hasil Cetak",
      desc: "Order banyak tetap dikerjakan rapi dan cepat.",
      src: "images/tumpukan-kertas.jpg"
    },
    {
      id: 6,
      cat: "finishing",
      title: "Stok ATK & Laminating",
      desc: "Kertas, amplop, binder, dan mesin laminating.",
      src: "images/rak-atk.jpg"
    }
  ];

  let filtered = galleryData.slice();
  let lbIndex = 0;

  const grid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImage");
  const lbTitle = document.getElementById("lbTitle");
  const lbDesc = document.getElementById("lbDesc");
  const lbCounter = document.getElementById("lbCounter");

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderGallery(list) {
    if (!grid) return;
    filtered = list;
    grid.innerHTML = list
      .map(function (item, i) {
        return (
          '<article class="gallery-card reveal show" data-index="' +
          i +
          '" data-cat="' +
          esc(item.cat) +
          '" tabindex="0" role="button" aria-label="Buka ' +
          esc(item.title) +
          '">' +
          '<span class="gallery-cat">' +
          esc(item.cat) +
          "</span>" +
          '<img class="gallery-img" src="' +
          esc(item.src) +
          '" alt="' +
          esc(item.title) +
          '" loading="lazy">' +
          '<div class="gallery-overlay"><span class="zoom-icon"><i class="fa-solid fa-magnifying-glass-plus"></i></span></div>' +
          '<div class="gallery-body"><h3>' +
          esc(item.title) +
          "</h3><p>" +
          esc(item.desc) +
          "</p></div></article>"
        );
      })
      .join("");

    grid.querySelectorAll(".gallery-card").forEach(function (card) {
      card.addEventListener("click", function () {
        openLightbox(Number(card.getAttribute("data-index")));
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(Number(card.getAttribute("data-index")));
        }
      });
    });
  }

  function openLightbox(index) {
    if (!filtered.length) return;
    lbIndex = index;
    const item = filtered[lbIndex];
    lbImage.src = item.src;
    lbImage.alt = item.title;
    lbTitle.textContent = item.title;
    lbDesc.textContent = item.desc;
    lbCounter.textContent = lbIndex + 1 + " / " + filtered.length;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function navLightbox(dir) {
    if (!filtered.length) return;
    lbIndex = (lbIndex + dir + filtered.length) % filtered.length;
    openLightbox(lbIndex);
  }

  document.getElementById("lbClose")?.addEventListener("click", closeLightbox);
  document.getElementById("lbPrev")?.addEventListener("click", function () {
    navLightbox(-1);
  });
  document.getElementById("lbNext")?.addEventListener("click", function () {
    navLightbox(1);
  });
  lightbox?.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (lightbox?.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navLightbox(-1);
    if (e.key === "ArrowRight") navLightbox(1);
  });

  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter-btn").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      const f = btn.getAttribute("data-filter");
      const list =
        f === "all" ? galleryData.slice() : galleryData.filter(function (g) {
          return g.cat === f;
        });
      renderGallery(list);
    });
  });

  renderGallery(galleryData);

  /* ---------- Toast helper ---------- */
  window.hfToast = function (msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(window._hfToast);
    window._hfToast = setTimeout(function () {
      t.classList.remove("show");
    }, 2200);
  };


  /* ---------- Smart Price Calculator ---------- */
  const calcService = document.getElementById("calcService");
  const calcQty = document.getElementById("calcQty");
  const calcTotal = document.getElementById("calcTotal");

  function formatRp(n) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(n || 0);
  }

  function updateCalc() {
    if (!calcService || !calcQty || !calcTotal) return;
    const opt = calcService.options[calcService.selectedIndex];
    const price = Number(opt.getAttribute("data-price") || 0);
    const qty = Math.max(1, Number(calcQty.value) || 1);
    calcTotal.textContent = formatRp(price * qty);
  }
  calcService?.addEventListener("change", updateCalc);
  calcQty?.addEventListener("input", updateCalc);
  updateCalc();

  /* ---------- Smart Quick Order → WhatsApp ---------- */
  const orderForm = document.getElementById("orderForm");
  orderForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("orderName").value.trim();
    const service = document.getElementById("orderService").value;
    const qty = document.getElementById("orderQty").value;
    const note = document.getElementById("orderNote").value.trim();
    if (!name) return;

    let msg =
      "Halo Hafinzah Fotocopy,%0A" +
      "Saya ingin order:%0A%0A" +
      "Nama: " + encodeURIComponent(name) + "%0A" +
      "Layanan: " + encodeURIComponent(service) + "%0A" +
      "Jumlah: " + encodeURIComponent(qty);
    if (note) msg += "%0ACatatan: " + encodeURIComponent(note);
    msg += "%0A%0ATerima kasih.";

    window.open("https://wa.me/6281296712644?text=" + msg, "_blank", "noopener");
    if (window.hfToast) window.hfToast("Membuka WhatsApp...");
  });

})();
