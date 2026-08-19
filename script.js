/* ================= MOBILE MENU ================= */

const header = document.querySelector(".header");
const menuButton = document.querySelector("#menuButton");

menuButton.addEventListener("click", () => {

    header.classList.toggle("mobile-open");

    const icon = menuButton.querySelector("i");

    if (header.classList.contains("mobile-open")) {

        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");

    } else {

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    }

});


/* ================= CLOSE MENU ================= */

document.querySelectorAll(".navbar a").forEach(link => {

    link.addEventListener("click", () => {

        header.classList.remove("mobile-open");

        const icon = menuButton.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* ================= SCROLL ANIMATION ================= */

const revealElements =
    document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {

    observer.observe(element);

});


/* ================= ACTIVE NAVBAR ================= */

const sections =
    document.querySelectorAll("section[id]");

const navLinks =
    document.querySelectorAll(".navbar a");

function updateActiveNav() {

    let current = "home";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            current = section.id;

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${current}`
        ) {

            link.classList.add("active");

        }

    });

}

window.addEventListener(
    "scroll",
    updateActiveNav
);

updateActiveNav();


/* ================= HERO PARALLAX ================= */

const heroVisual =
    document.querySelector(".hero-visual");

window.addEventListener("mousemove", event => {

    if (window.innerWidth < 950) return;

    const x =
        (event.clientX / window.innerWidth - .5) * 8;

    const y =
        (event.clientY / window.innerHeight - .5) * 8;

    heroVisual.style.transform =
        `translate(${x}px, ${y}px)`;

});


/* ================= SMOOTH BUTTON ================= */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(link => {

    link.addEventListener("click", event => {

        const target =
            document.querySelector(
                link.getAttribute("href")
            );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth"
        });

    });

});
