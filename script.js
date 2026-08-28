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
