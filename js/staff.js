// ===== AZoom Car Rental - Staff Portal =====
// 1. Show numbers and a table of all bookings
// 2. Hand over the keys when a customer picks up a car
// 3. Inspect a returned car, add damage fees and photos, and create the final bill
// 4. Keep cars that need repair or cleaning out of service until they are ready

// ---------- 1. Get the HTML elements ----------
const staffNameText = document.querySelector("#staff-name");
const statNumbers = document.querySelectorAll(".stat-number");
const tableBody = document.querySelector("#staff-table-body");

const inspectionForm = document.querySelector("#inspection-form");
const inspectSelect = document.querySelector("#inspect-booking");
const carparkSelect = document.querySelector("#inspect-carpark");
const batteryInput = document.querySelector("#inspect-battery");
const kmInput = document.querySelector("#inspect-km");
const damageChecks = document.querySelectorAll(".damage-check");
const lateDaysInput = document.querySelector("#late-days");
const notesInput = document.querySelector("#inspect-notes");
const photosInput = document.querySelector("#inspect-photos");
const carStatusSelect = document.querySelector("#car-status");
const extraAmountText = document.querySelector("#extra-amount");
const inspectMessage = document.querySelector("#inspect-message");
const fleetBody = document.querySelector("#fleet-table-body");

const LATE_FEE_PER_DAY = 100;
const MAX_PHOTOS = 3;

// ---------- 2. Only staff can use this page ----------
function checkStaff() {
  const user = getCurrentUser();
  if (user === null || user.role !== "staff") {
    document.querySelector("main").innerHTML = `
      <section class="login-section">
        <div class="login-card">
          <h1 class="login-title">Staff Only</h1>
          <p class="login-intro">Please log in with a staff account to use the Staff Portal.</p>
          <a href="login.html" class="btn">Go to Login</a>
        </div>
      </section>
    `;
    return false;
  }
  staffNameText.textContent = "Staff - " + user.name;
  return true;
}

// ---------- 3. Count how many bookings have a status ----------
function countStatus(list, status) {
  let count = 0;
  for (const booking of list) {
    if (booking.status === status) {
      count++;
    }
  }
  return count;
}

// ---------- 4. Show the 4 numbers at the top ----------
function displayStats(list) {
  // a car is free today when it can be rented and nobody is using it today
  const today = todayText();
  const tomorrow = addDays(today, 1);
  let availableCars = 0;
  for (const car of cars) {
    if (canBeRented(car) && findClash(car.id, today, tomorrow) === null) {
      availableCars++;
    }
  }

  statNumbers[0].textContent = countStatus(list, "reserved");
  statNumbers[1].textContent = countStatus(list, "picked");
  statNumbers[2].textContent = countStatus(list, "returned");
  statNumbers[3].textContent = availableCars;
}

// ---------- 5. What to show in the "Action" column ----------
// statuses where staff have nothing to do, only a short note
const waitText = {
  picked: "On the road",
  inspected: "Waiting for payment",
  paid: "Done",
  cancelled: "Cancelled"
};

function makeAction(booking) {
  const ref = escapeHTML(booking.ref);
  if (booking.status === "reserved") {
    return `<button type="button" class="table-btn handover-btn" data-ref="${ref}">Hand Over Keys</button>`;
  }
  if (booking.status === "returned") {
    return `<button type="button" class="table-btn table-btn-main inspect-btn" data-ref="${ref}">Inspect</button>`;
  }
  return `<span class="table-wait">${waitText[booking.status]}</span>`;
}

// ---------- 6. Show the table of all bookings ----------
function displayTable(list) {
  let html = "";

  // newest booking first (slice() makes a copy so the saved order does not change)
  const newestFirst = list.slice().reverse();

  for (const booking of newestFirst) {
    const car = findCar(booking.carId);

    // phone and licence number (older sample bookings may not have them)
    let contact = "";
    if (booking.phone) {
      contact = `<span class="table-sub">${escapeHTML(booking.phone)} · ${escapeHTML(booking.licence)}</span>`;
    }

    html += `
      <tr>
        <td>${escapeHTML(booking.ref)}</td>
        <td>${escapeHTML(booking.name)}${contact}</td>
        <td>${car.name}</td>
        <td>${formatDate(booking.pickupDate)} · ${formatPeriod(booking.duration, booking.period)}</td>
        <td><span class="status ${statusClass[booking.status]}">${statusText[booking.status]}</span></td>
        <td>${makeAction(booking)}</td>
      </tr>
    `;
  }

  tableBody.innerHTML = html;
}

// ---------- 7. Fill the "Booking" drop-down with returned cars ----------
function fillInspectOptions(list) {
  let html = `<option value="">-- Choose a returned car --</option>`;
  for (const booking of list) {
    if (booking.status === "returned") {
      const car = findCar(booking.carId);
      html += `<option value="${escapeHTML(booking.ref)}">${escapeHTML(booking.ref)} - ${car.name} - ${escapeHTML(booking.name)}</option>`;
    }
  }
  inspectSelect.innerHTML = html;
}

// ---------- 8. Show the fleet and which cars are out of service ----------
const carStatusText = {
  available: "Ready to rent",
  repair: "Needs repair",
  cleaning: "Needs cleaning"
};

function displayFleet() {
  let html = "";
  for (const car of cars) {
    const status = getCarStatus(car.id);

    let statusLabel = `<span class="status status-reserved">${carStatusText[status]}</span>`;
    let action = `<span class="table-wait">-</span>`;
    if (car.available === false) {
      statusLabel = `<span class="status status-paid">Not in service</span>`;
    } else if (status !== "available") {
      statusLabel = `<span class="status status-bill">${carStatusText[status]}</span>`;
      action = `<button type="button" class="table-btn ready-btn" data-car="${car.id}">Mark Ready</button>`;
    }

    html += `
      <tr>
        <td>${car.name}</td>
        <td>${car.type}</td>
        <td>${car.branch}</td>
        <td>${statusLabel}</td>
        <td>${action}</td>
      </tr>
    `;
  }
  fleetBody.innerHTML = html;
}

// "Mark Ready": the car is fixed or cleaned and can be rented again
fleetBody.addEventListener("click", function (event) {
  const button = event.target;
  if (button.classList.contains("ready-btn")) {
    setCarStatus(button.dataset.car, "available");
    refreshPage();
  }
});

// ---------- 9. Show everything again (after any change) ----------
function refreshPage() {
  const bookings = getBookings();
  displayStats(bookings);
  displayTable(bookings);
  fillInspectOptions(bookings);
  displayFleet();
}

// ---------- 10. Work out the extra charges while staff tick the boxes ----------
// the text next to a damage checkbox, e.g. "Scratch on body"
function getDamageName(box) {
  return box.parentElement.querySelector(".damage-name").textContent;
}

function getExtraCharges() {
  let total = 0;
  for (const box of damageChecks) {
    if (box.checked === true) {
      total = total + Number(box.value);
    }
  }
  total = total + Number(lateDaysInput.value) * LATE_FEE_PER_DAY;
  return total;
}

function updateExtra() {
  extraAmountText.textContent = "$" + getExtraCharges();
}

inspectionForm.addEventListener("change", updateExtra);
inspectionForm.addEventListener("input", updateExtra);

// if the battery is below 20%, tick "Battery below 20%" for the staff
batteryInput.addEventListener("input", function () {
  for (const box of damageChecks) {
    if (getDamageName(box) === "Battery below 20%") {
      box.checked = batteryInput.value !== "" && Number(batteryInput.value) < 20;
    }
  }
  updateExtra();
});

// when staff choose a booking, show the car park the customer used
inspectSelect.addEventListener("change", function () {
  const booking = findBooking(getBookings(), inspectSelect.value);
  if (booking !== null && booking.returnCarpark !== "") {
    carparkSelect.value = booking.returnCarpark;
  }
  inspectMessage.textContent = "";
});

// ---------- 11. Table buttons: Hand Over Keys and Inspect ----------
tableBody.addEventListener("click", function (event) {
  const button = event.target;
  const ref = button.dataset.ref;

  if (button.classList.contains("handover-btn")) {
    updateBooking(ref, { status: "picked" });   // in data.js
    refreshPage();
  }

  if (button.classList.contains("inspect-btn")) {
    inspectSelect.value = ref;
    inspectSelect.dispatchEvent(new Event("change"));
    document.querySelector("#inspection").scrollIntoView({ behavior: "smooth" });
  }
});

// ---------- 12. Make a small copy of a photo so it fits in localStorage ----------
// FileReader reads the file, then a canvas shrinks it to max 800px wide as a JPEG
function shrinkPhoto(file) {
  return new Promise(function (resolve, reject) {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = function () {
      const img = new Image();
      img.onerror = reject;
      img.onload = function () {
        const scale = Math.min(1, 800 / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ---------- 13. Save the inspection and create the final bill ----------
inspectionForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  inspectMessage.classList.remove("form-success");

  const bookings = getBookings();
  const booking = findBooking(bookings, inspectSelect.value);
  if (booking === null) {
    inspectMessage.textContent = "Please choose a returned car first.";
    return;
  }

  if (photosInput.files.length > MAX_PHOTOS) {
    inspectMessage.textContent = "Please choose up to " + MAX_PHOTOS + " photos.";
    return;
  }

  // shrink the photos so the customer can see them on the final bill
  const photos = [];
  try {
    for (const file of photosInput.files) {
      photos.push(await shrinkPhoto(file));
    }
  } catch (error) {
    inspectMessage.textContent = "One of the photos could not be read. Please choose JPG or PNG images.";
    return;
  }

  // make a list of the damage that was ticked
  const damages = [];
  for (const box of damageChecks) {
    if (box.checked === true) {
      damages.push({ name: getDamageName(box), fee: Number(box.value) });
    }
  }

  const lateDays = Number(lateDaysInput.value);
  if (lateDays > 0) {
    damages.push({ name: "Late return: " + lateDays + " day(s)", fee: lateDays * LATE_FEE_PER_DAY });
  }

  // save the result in the booking
  booking.damages = damages;
  booking.extra = getExtraCharges();
  booking.notes = notesInput.value.trim();
  booking.battery = Number(batteryInput.value);
  booking.km = Number(kmInput.value);
  booking.photos = photos;
  booking.carStatus = carStatusSelect.value;
  booking.status = "inspected";

  // localStorage can hold about 5 MB, so save without photos if they do not fit
  let message = "Saved. The final bill for " + booking.ref + " is now on the customer's My Bookings page.";
  try {
    saveBookings(bookings);
  } catch (error) {
    booking.photos = [];
    saveBookings(bookings);
    message = message + " The photos were too large to keep.";
  }

  // a car that needs repair or cleaning cannot be booked until staff mark it ready
  setCarStatus(booking.carId, carStatusSelect.value);

  inspectMessage.textContent = message;
  inspectMessage.classList.add("form-success");

  inspectionForm.reset();
  updateExtra();
  refreshPage();
});

// ---------- 14. When the page opens ----------
if (checkStaff() === true) {
  refreshPage();
  updateExtra();
}
