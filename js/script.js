const phoneNumber = "2348129635552";
const whatsappBase = `https://wa.me/${phoneNumber}`;

const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const toTop = document.getElementById("toTop");
const orderForm = document.getElementById("orderForm");
const formStatus = document.getElementById("formStatus");
const yearNode = document.getElementById("year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const setActiveTab = () => {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((section) => observer.observe(section));
};

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (header) {
  const updateHeaderState = () => {
    header.classList.toggle("is-stuck", window.scrollY > 12);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => revealObserver.observe(el));
}

const countEls = document.querySelectorAll("[data-count]");
if (countEls.length) {
  const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const animateCounter = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeInOutCubic(progress);
      const value = Math.round(target * eased);
      el.textContent = `${value}${target >= 100 ? "" : ""}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target}`;
      }
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  countEls.forEach((el) => counterObserver.observe(el));
}

const waLinks = document.querySelectorAll("[data-wa]");
waLinks.forEach((link) => {
  const message = link.dataset.waMessage || "Hello Emek Services, I would like to request a service.";
  const href = `${whatsappBase}?text=${encodeURIComponent(message)}`;
  link.setAttribute("href", href);
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
});

const cardOrders = document.querySelectorAll(".card-order");
cardOrders.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.order || "Service request";
    const message = `Hello Emek Services, I want to order: ${selected}. Please send me a quote.`;
    window.open(`${whatsappBase}?text=${encodeURIComponent(message)}`, "_blank");
  });
});

const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");
  button.addEventListener("click", () => {
    const active = item.classList.contains("active");
    faqItems.forEach((faq) => faq.classList.remove("active"));
    if (!active) item.classList.add("active");
  });
});

const galleryShots = [...document.querySelectorAll(".shot")];
const galleryFilters = document.querySelectorAll(".chip");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let currentGalleryIndex = 0;

const openLightbox = (index) => {
  if (!galleryShots.length || !lightbox || !lbImg) return;
  currentGalleryIndex = index;
  const item = galleryShots[index];
  if (!item) return;
  const img = item.querySelector("img");
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCap.textContent = item.querySelector("figcaption")?.textContent || "";
  lightbox.removeAttribute("hidden");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.setAttribute("hidden", "hidden");
  document.body.style.overflow = "";
};

if (galleryShots.length) {
  galleryShots.forEach((shot, index) => {
    shot.addEventListener("click", () => openLightbox(index));
  });

  lbClose?.addEventListener("click", closeLightbox);
  lbPrev?.addEventListener("click", () => {
    const nextIndex = (currentGalleryIndex - 1 + galleryShots.length) % galleryShots.length;
    openLightbox(nextIndex);
  });
  lbNext?.addEventListener("click", () => {
    const nextIndex = (currentGalleryIndex + 1) % galleryShots.length;
    openLightbox(nextIndex);
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox && !lightbox.hasAttribute("hidden")) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowRight") {
        const nextIndex = (currentGalleryIndex + 1) % galleryShots.length;
        openLightbox(nextIndex);
      }
      if (event.key === "ArrowLeft") {
        const nextIndex = (currentGalleryIndex - 1 + galleryShots.length) % galleryShots.length;
        openLightbox(nextIndex);
      }
    }
  });
}

galleryFilters.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter;
    galleryFilters.forEach((btn) => btn.classList.toggle("is-active", btn === chip));

    galleryShots.forEach((shot) => {
      const match = filter === "all" || shot.dataset.cat === filter;
      shot.classList.toggle("is-hidden", !match);
    });
  });
});

const validateField = (fieldId, message) => {
  const field = document.getElementById(fieldId);
  const err = document.querySelector(`[data-err="${fieldId}"]`);
  if (!field || !err) return false;

  const value = field.type === "checkbox" ? field.checked : field.value.trim();
  const isValid = field.type === "checkbox" ? value : Boolean(value);

  err.textContent = isValid ? "" : message;
  field.setAttribute("aria-invalid", String(!isValid));
  return isValid;
};

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const validName = validateField("fullname", "Please enter your full name.");
    const validPhone = validateField("phone", "Please enter a valid phone number.");
    const validService = validateField("service", "Please choose a service.");
    const validAddress = validateField("address", "Please enter the job location.");
    const validConsent = validateField("consent", "Please agree to be contacted.");

    if (!validName || !validPhone || !validService || !validAddress || !validConsent) {
      formStatus.textContent = "Please fix the highlighted fields and try again.";
      formStatus.style.color = "#c33";
      return;
    }

    const formData = new FormData(orderForm);
    const payment = formData.get("payment") || "Bank transfer";
    const details = formData.get("detail") || "N/A";
    const when = formData.get("when") || "N/A";
    const notes = formData.get("notes") || "N/A";

    const message = [
      "Hello Emek Services, I would like to place an order.",
      `Full name: ${formData.get("fullname")}`,
      `Phone number: ${formData.get("phone")}`,
      `Service: ${formData.get("service")}`,
      `Detail: ${details}`,
      `Location: ${formData.get("address")}`,
      `Preferred date/time: ${when}`,
      `Notes: ${notes}`,
      `Preferred payment: ${payment}`,
      "Please confirm the quote and next steps."
    ].join("\n");

    const url = `${whatsappBase}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    formStatus.textContent = "Your order has been prepared in WhatsApp.";
    formStatus.style.color = "#0d7a38";
  });

  const smsLink = document.getElementById("smsLink");
  if (smsLink) {
    smsLink.addEventListener("click", (event) => {
      event.preventDefault();
      const formData = new FormData(orderForm);
      const message = [
        `Name: ${formData.get("fullname") || ""}`,
        `Phone: ${formData.get("phone") || ""}`,
        `Service: ${formData.get("service") || ""}`,
        `Location: ${formData.get("address") || ""}`,
        `Notes: ${formData.get("notes") || ""}`
      ].join("; ");
      window.location.href = `sms:+2348129635552?body=${encodeURIComponent(message)}`;
    });
  }
}

window.addEventListener("scroll", () => {
  if (toTop) {
    toTop.classList.toggle("visible", window.scrollY > 300);
  }
});

toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

setActiveTab();
