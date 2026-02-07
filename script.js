const floatingLayer = document.getElementById("floatingLayer");
const surpriseBtn = document.getElementById("surpriseBtn");
const sparkleBtn = document.getElementById("sparkleBtn");
const secret = document.getElementById("secret");
const note = document.getElementById("note");
const TIME_ZONE = "America/Chicago";
const BIRTHDAY_MONTH = 2;
const BIRTHDAY_DAY = 9;

const timeEls = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds"),
};

function getZonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const lookup = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      lookup[part.type] = part.value;
    }
  }

  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour),
    minute: Number(lookup.minute),
    second: Number(lookup.second),
  };
}

function getOffsetMinutes(date, timeZone) {
  const parts = getZonedParts(date, timeZone);
  const asUTC = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return Math.round((asUTC - date.getTime()) / 60000);
}

function zonedDateTimeToUtc(year, month, day, hour, minute, second, timeZone) {
  let utc = Date.UTC(year, month - 1, day, hour, minute, second);
  for (let i = 0; i < 2; i += 1) {
    const offsetMinutes = getOffsetMinutes(new Date(utc), timeZone);
    utc = Date.UTC(year, month - 1, day, hour, minute, second) - offsetMinutes * 60000;
  }
  return new Date(utc);
}

function getNextBirthday(timeZone) {
  const now = new Date();
  const nowParts = getZonedParts(now, timeZone);
  let year = nowParts.year;
  let target = zonedDateTimeToUtc(
    year,
    BIRTHDAY_MONTH,
    BIRTHDAY_DAY,
    0,
    0,
    0,
    timeZone
  );

  if (now >= target) {
    year += 1;
    target = zonedDateTimeToUtc(
      year,
      BIRTHDAY_MONTH,
      BIRTHDAY_DAY,
      0,
      0,
      0,
      timeZone
    );
  }

  return target;
}

function updateCountdown() {
  const now = new Date();
  const target = getNextBirthday(TIME_ZONE);
  const totalSeconds = Math.max(0, Math.floor((target - now) / 1000));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  timeEls.days.textContent = days;
  timeEls.hours.textContent = hours.toString().padStart(2, "0");
  timeEls.minutes.textContent = minutes.toString().padStart(2, "0");
  timeEls.seconds.textContent = seconds.toString().padStart(2, "0");
}

function createFloater(type) {
  const floater = document.createElement("span");
  floater.className = `floater ${type}`;

  const size = type === "heart" ? 14 + Math.random() * 14 : 4 + Math.random() * 4;
  floater.style.width = `${size}px`;
  floater.style.height = `${size}px`;
  floater.style.left = `${Math.random() * 100}%`;
  floater.style.animationDuration = `${8 + Math.random() * 6}s`;
  floater.style.animationDelay = `${Math.random() * 6}s`;
  if (type === "heart") {
    const heartColors = ["#ff6f91", "#ff9fb8", "#ffc3a0", "#ffd6e8", "#f6a6c1"];
    floater.style.setProperty(
      "--heart-color",
      heartColors[Math.floor(Math.random() * heartColors.length)]
    );
  }

  floatingLayer.appendChild(floater);
}

function createFloaters() {
  for (let i = 0; i < 12; i += 1) {
    createFloater("heart");
  }
  for (let i = 0; i < 18; i += 1) {
    createFloater("sparkle");
  }
}

function createBurst(x, y) {
  for (let i = 0; i < 20; i += 1) {
    const burst = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 70;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance * -1;

    burst.className = "burst";
    burst.style.left = `${x}px`;
    burst.style.top = `${y}px`;
    burst.style.setProperty("--x", `${dx}px`);
    burst.style.setProperty("--y", `${dy}px`);
    burst.style.animationDuration = `${1.1 + Math.random() * 0.6}s`;

    floatingLayer.appendChild(burst);
    setTimeout(() => burst.remove(), 2000);
  }
}

function createConfettiAt(x, y) {
  const colors = ["#ff6f91", "#ffc3a0", "#ffd6e8", "#ff4f79", "#f6a6c1"];
  for (let i = 0; i < 26; i += 1) {
    const piece = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 110;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance * -1;
    const size = 6 + Math.random() * 6;

    piece.className = "confetti";
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    piece.style.setProperty("--x", `${dx}px`);
    piece.style.setProperty("--y", `${dy}px`);
    piece.style.setProperty("--r", `${Math.random() * 360}deg`);
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.6}px`;

    floatingLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 2200);
  }
}

function createConfettiAcrossPage() {
  const bursts = 6;
  for (let i = 0; i < bursts; i += 1) {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    createConfettiAt(x, y);
  }
}

function createButterflies() {
  const colors = ["#ff6f91", "#ffc3a0", "#ffd6e8", "#ff9fb8", "#f6a6c1"];
  const count = 7;

  for (let i = 0; i < count; i += 1) {
    const butterfly = document.createElement("div");
    butterfly.className = "butterfly";
    butterfly.style.setProperty("--top", `${10 + Math.random() * 70}vh`);
    butterfly.style.setProperty("--delay", `${Math.random() * 6}s`);
    butterfly.style.setProperty("--duration", `${14 + Math.random() * 10}s`);
    butterfly.style.setProperty("--scale", `${0.7 + Math.random() * 0.6}`);
    butterfly.style.setProperty("--drift", `${-40 + Math.random() * 80}px`);
    const colorA = colors[Math.floor(Math.random() * colors.length)];
    const colorB = colors[Math.floor(Math.random() * colors.length)];
    butterfly.style.setProperty("--color", colorA);
    butterfly.style.setProperty("--color2", colorB);

    const body = document.createElement("span");
    body.className = "butterfly-body";
    butterfly.appendChild(body);
    floatingLayer.appendChild(butterfly);
  }
}

function burstFromElement(element) {
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  createBurst(x, y);
}

surpriseBtn.addEventListener("click", () => {
  note.classList.add("highlight");
  secret.classList.add("reveal");
  burstFromElement(surpriseBtn);
  secret.scrollIntoView({ behavior: "smooth", block: "center" });
});

sparkleBtn.addEventListener("click", () => {
  const rect = sparkleBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  createBurst(x, y);
  createConfettiAcrossPage();
});

createFloaters();
createButterflies();
updateCountdown();
setInterval(updateCountdown, 1000);
