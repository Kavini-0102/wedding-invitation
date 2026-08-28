// ============================================================
// MANDALA GENERATOR (used for the four corner medallions)
// Draws a lace-like radial medallion into an <svg viewBox="0 0 300 300">.
// ============================================================
function buildMandala(svg, opts) {
  opts = opts || {};
  const rings = opts.rings || 2;
  const basePetals = opts.petalsPerRing || 8;
  const rMax = opts.rMax || 120;
  const ns = "http://www.w3.org/2000/svg";
  const cx = 150, cy = 150;

  for (let ring = 1; ring <= rings; ring++) {
    const r = (rMax / rings) * ring;

    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "var(--gold-dim)");
    circle.setAttribute("stroke-width", "0.75");
    circle.setAttribute("opacity", "0.45");
    svg.appendChild(circle);

    const petals = basePetals + ring * 3;
    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const size = 5 + ring * 1.4;
      const deg = (angle * 180) / Math.PI + 90;

      const petal = document.createElementNS(ns, "path");
      const d = `M ${x} ${y - size} Q ${x + size} ${y} ${x} ${y + size} Q ${x - size} ${y} ${x} ${y - size} Z`;
      petal.setAttribute("d", d);
      petal.setAttribute("transform", `rotate(${deg} ${x} ${y})`);
      petal.setAttribute("fill", "none");
      petal.setAttribute("stroke", ring % 2 === 0 ? "var(--gold)" : "var(--gold-soft)");
      petal.setAttribute("stroke-width", "1");
      petal.setAttribute("opacity", 0.5 + ring * 0.08);
      svg.appendChild(petal);
    }
  }

  const dot = document.createElementNS(ns, "circle");
  dot.setAttribute("cx", cx);
  dot.setAttribute("cy", cy);
  dot.setAttribute("r", 4);
  dot.setAttribute("fill", "var(--gold)");
  svg.appendChild(dot);
}

(function buildCornerMedallions() {
  document.querySelectorAll(".corner-motif svg").forEach((svg) => {
    buildMandala(svg, { rings: 2, petalsPerRing: 8, rMax: 120 });
  });
})();

// ============================================================
// SANNASA — traditional scroll-decree entrance
// A rolled ola-leaf/parchment scroll sits tied with a cord and
// wax seal. The cord loosens, the seal fades, and the two rolled
// ends unwind outward as the parchment unfurls to reveal the
// invitation — evoking the sannasa (royal decree scroll) of
// Sri Lankan tradition. Respects prefers-reduced-motion.
// ============================================================
(function sannasaSequence() {
  const overlay = document.getElementById("sannasaOverlay");
  if (!overlay) return;

  const enterBtn = document.getElementById("sannasaEnter");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    overlay.classList.add("hidden");
    return;
  }

  document.body.classList.add("sannasa-active");

  function openSannasa() {
    overlay.classList.add("opening");
    document.body.classList.remove("sannasa-active");
    setTimeout(() => {
      overlay.classList.add("hidden");
      startPetalField();
    }, 1700);
  }

  // A brief pause to let the sealed scroll register, then auto-unfurl
  const autoTimer = setTimeout(openSannasa, 2400);

  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      clearTimeout(autoTimer);
      openSannasa();
    });
  }
})();

// ============================================================
// AMBIENT PETAL FIELD
// A handful of drifting petals over the hero, started once the
// sannasa has opened. Skipped entirely under reduced motion.
// ============================================================
function startPetalField() {
  const field = document.getElementById("petalField");
  if (!field) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const glyphs = ["🌸", "🌼", "🌺"];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.textContent = glyphs[i % glyphs.length];
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.fontSize = `${12 + Math.random() * 10}px`;
    petal.style.animationDuration = `${9 + Math.random() * 8}s`;
    petal.style.animationDelay = `${Math.random() * 6}s`;
    field.appendChild(petal);
  }
}

// If the sannasa is skipped (reduced motion), still show a gentle petal field
(function maybeStartPetalsImmediately() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const overlay = document.getElementById("sannasaOverlay");
  if (reduceMotion || !overlay) startPetalField();
})();

// ============================================================
// SCROLL REVEAL
// Sections and event cards fade/slide in as they enter view.
// ============================================================
(function scrollReveal() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll(".section, .event-card");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("in-view"));
    return;
  }

  targets.forEach((t) => t.classList.add("reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((t) => io.observe(t));
})();

// ============================================================
// COUNTDOWN TIMER — to 24 Dec 2026
// ============================================================
const WEDDING_DATE = new Date("2026-12-24T10:00:00+05:30").getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = WEDDING_DATE - now;

  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
  };
  if (!els.days) return;

  if (diff <= 0) {
    els.days.textContent = "00";
    els.hours.textContent = "00";
    els.mins.textContent = "00";
    els.secs.textContent = "00";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  els.days.textContent = String(days).padStart(2, "0");
  els.hours.textContent = String(hours).padStart(2, "0");
  els.mins.textContent = String(mins).padStart(2, "0");
  els.secs.textContent = String(secs).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================
// PERSONALIZED INVITE LINKS
// Reads ?to=Guest+Name&type=one|two|family from the URL so each
// WhatsApp link you send can greet the guest by name and
// pre-select how many seats to hold for them.
// ============================================================
(function personalizeFromURL() {
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("to");
  const inviteType = params.get("type"); // "one" | "two" | "family"

  if (guestName) {
    const greeting = document.getElementById("heroGreeting");
    if (greeting) {
      greeting.textContent = `Dear ${decodeURIComponent(guestName)},`;
      greeting.hidden = false;
    }
    const nameInput = document.getElementById("guestName");
    if (nameInput) nameInput.value = decodeURIComponent(guestName);
  }

  if (inviteType && ["one", "two", "family"].includes(inviteType)) {
    // Pre-select "attending" -> reveals the party size field, then pre-select it
    const attendingSelect = document.getElementById("attending");
    const partySizeField = document.getElementById("partySizeField");
    const partySizeSelect = document.getElementById("partySize");
    if (attendingSelect && partySizeSelect && partySizeField) {
      attendingSelect.value = "yes";
      partySizeField.hidden = false;
      partySizeSelect.required = true;
      partySizeSelect.value = inviteType;
      if (inviteType === "family") {
        const familyCountField = document.getElementById("familyCountField");
        const familyCountInput = document.getElementById("familyCount");
        familyCountField.hidden = false;
        familyCountInput.required = true;
      }
    }
  }
})();

// ============================================================
// RSVP FORM LOGIC
// ============================================================
const attendingSelect = document.getElementById("attending");
const partySizeField = document.getElementById("partySizeField");
const partySizeSelect = document.getElementById("partySize");
const familyCountField = document.getElementById("familyCountField");
const familyCountInput = document.getElementById("familyCount");
const form = document.getElementById("rsvpForm");
const successBlock = document.getElementById("rsvpSuccess");
const successHeading = document.getElementById("successHeading");
const successMessage = document.getElementById("successMessage");

// Show/hide "who is joining" based on attendance
attendingSelect.addEventListener("change", () => {
  const isYes = attendingSelect.value === "yes";
  partySizeField.hidden = !isYes;
  partySizeSelect.required = isYes;
  if (!isYes) {
    partySizeSelect.value = "";
    familyCountField.hidden = true;
    familyCountInput.required = false;
    familyCountInput.value = "";
  }
});

// Show family headcount only when "family" is selected
partySizeSelect.addEventListener("change", () => {
  const isFamily = partySizeSelect.value === "family";
  familyCountField.hidden = !isFamily;
  familyCountInput.required = isFamily;
  if (!isFamily) familyCountInput.value = "";
});

// Human-readable label for the chosen party size
function partySizeLabel(value, familyCount) {
  switch (value) {
    case "one":
      return "Just Me (1 guest)";
    case "two":
      return "Me & Partner (2 guests)";
    case "family":
      return `Family (${familyCount || "3+"} guests)`;
    default:
      return "";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("guestName").value.trim(),
    attending: attendingSelect.value,
    partySize: partySizeSelect.value,
    familyCount: familyCountInput.value,
    message: document.getElementById("message").value.trim(),
  };

  // ----------------------------------------------------------
  // OPTIONAL: send to a real backend (Formspree, Google Sheets,
  // your own API route, etc). Uncomment and set your endpoint:
  //
  // await fetch("https://formspree.io/f/yourFormId", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json", Accept: "application/json" },
  //   body: JSON.stringify(data),
  // });
  // ----------------------------------------------------------

  form.hidden = true;
  successBlock.hidden = false;

  if (data.attending === "yes") {
    successHeading.textContent = "Thank You, " + (data.name || "Friend") + "!";
    successMessage.textContent =
      "Your reply has been recorded — joining as: " +
      partySizeLabel(data.partySize, data.familyCount) +
      ". We can't wait to celebrate with you.";
  } else {
    successHeading.textContent = "We'll Miss You";
    successMessage.textContent =
      "Thank you for letting us know, " + (data.name || "Friend") + ". You'll be in our thoughts on the day.";
  }
});