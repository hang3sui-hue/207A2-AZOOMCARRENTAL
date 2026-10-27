// ===== AZoom Car Rental - My Bookings page =====
// Shows the bookings of the customer who is logged in.
// The customer can: pick up the car, cancel, return the car, and pay the final bill.

// ---------- 1. Get the HTML elements ----------
const bookingList = document.querySelector("#booking-list");
const userNameText = document.querySelector("#user-name");

const trackSteps = ["Reserved", "Picked Up", "Returned", "Inspected", "Paid"];

// how far each status is along the progress line
const statusStep = {
  reserved: 1,
  picked: 2,
  returned: 3,
  inspected: 4,
  paid: 5,
  cancelled: 0
};

// ---------- 2. Make the progress line: Reserved > Picked Up > Returned > Inspected > Paid ----------
function makeTracker(status) {
  const step = statusStep[status];
  let html = `<ol class="tracker">`;

  for (let i = 0; i < trackSteps.length; i++) {
    let className = "track-step";
    if (i < step) {
      className += " done";
    } else if (i === step) {
      className += " current";
    }
    html += `<li class="${className}">${trackSteps[i]}</li>`;
  }

  html += `</ol>`;
  return html;
}

// ---------- 3. Make the final bill table ----------
function makeBill(booking) {
  let rows = `<tr><td>Rental: ${formatPeriod(booking.duration, booking.period)}</td><td class="bill-amount">$${booking.rental}</td></tr>`;

  for (const damage of booking.damages) {
    rows += `<tr><td>${escapeHTML(damage.name)}</td><td class="bill-amount">$${damage.fee}</td></tr>`;
  }

  rows += `<tr><td>Already paid: rental</td><td class="bill-amount bill-minus">- $${booking.rental}</td></tr>`;
  rows += `<tr><td>Deposit</td><td class="bill-amount bill-minus">- $${booking.deposit}</td></tr>`;

  // extra charges are taken from the deposit first
  let toPay = booking.extra - booking.deposit;
  let refund = booking.deposit - booking.extra;
  if (toPay < 0) {
    toPay = 0;
  }
  if (refund < 0) {
    refund = 0;
  }

  let notes = "";
  if (booking.notes !== "") {
    notes = `<p class="bill-note">Staff notes: ${escapeHTML(booking.notes)}</p>`;
  }

  // photos of the damage taken by staff (saved as small images)
  let photos = "";
  if (Array.isArray(booking.photos) && booking.photos.length > 0) {
    photos = `<div class="bill-photos">`;
    for (const photo of booking.photos) {
      // only show real image data, nothing else
      if (String(photo).startsWith("data:image/")) {
        photos += `<a href="${photo}" target="_blank"><img src="${photo}" alt="Photo of damage" class="bill-photo"></a>`;
      }
    }
    photos += `</div>`;
  }

  return `
    <div class="bill">
      <h3 class="bill-title">Final Bill</h3>
      <table class="bill-table">
        <tbody>${rows}</tbody>
        <tfoot>
          <tr class="bill-total"><td>Amount to pay</td><td class="bill-amount">$${toPay}</td></tr>
          <tr class="bill-refund"><td>Refund to your card</td><td class="bill-amount">$${refund}</td></tr>
        </tfoot>
      </table>
      ${notes}
      ${photos}
      <form class="pay-form" data-ref="${escapeHTML(booking.ref)}">
        <label class="check-option">
          <input type="checkbox" class="check-input" checked required>
          <span class="check-text">Use the same credit card I used for the booking</span>
        </label>
        <button type="submit" class="btn pay-btn">Pay Final Bill</button>
      </form>
    </div>
  `;
}

// ---------- 4. Make the part that changes with the status (buttons / forms) ----------
function makeActionPart(booking) {
  if (booking.status === "reserved") {
    return `
      <div class="booking-actions">
        <p class="action-hint">Visit the branch with your licence. Our staff will hand you the keys.</p>
        <button type="button" class="btn pickup-btn" data-ref="${escapeHTML(booking.ref)}">Pick Up Car at Office</button>
        <button type="button" class="ViewCars cancel-btn" data-ref="${escapeHTML(booking.ref)}">Cancel Booking</button>
      </div>
    `;
  }

  if (booking.status === "picked") {
    return `
      <form class="return-form" data-ref="${escapeHTML(booking.ref)}">
        <label for="park-${escapeHTML(booking.ref)}" class="form-label">Where did you park the car?</label>
        <select id="park-${escapeHTML(booking.ref)}" class="form-input return-park" required>
          <option value="">-- Choose a car park --</option>
          <option value="King Road Car Park">Level B1, King Road Car Park</option>
          <option value="Queen Road Car Park">Level 1, Queen Road Car Park</option>
        </select>
        <label for="bay-${escapeHTML(booking.ref)}" class="form-label">Parking bay number</label>
        <input type="text" id="bay-${escapeHTML(booking.ref)}" class="form-input return-bay" placeholder="B1-24" required>
        <button type="submit" class="btn return-btn">Return Car</button>
      </form>
    `;
  }

  if (booking.status === "returned") {
    return `
      <div class="booking-actions">
        <p class="action-hint">Thank you. Our staff will check the car soon, then your final bill will show here.</p>
      </div>
    `;
  }

  if (booking.status === "inspected") {
    return makeBill(booking);
  }

  if (booking.status === "paid") {
    return `
      <div class="booking-actions">
        <p class="action-hint">All done. Thank you for driving with AZoom.</p>
      </div>
    `;
  }

  // cancelled
  return `
    <div class="booking-actions">
      <p class="action-hint">This booking was cancelled. Your payment will be refunded to your card.</p>
    </div>
  `;
}

// ---------- 5. Make ONE booking card ----------
function makeBookingCard(booking) {
  const car = findCar(booking.carId);

  let doneClass = "";
  if (booking.status === "paid" || booking.status === "cancelled") {
    doneClass = " booking-done";
  }

  let returnInfo = "";
  if (booking.returnCarpark !== "") {
    returnInfo = `<div class="detail"><dt>Returned to</dt><dd>${escapeHTML(booking.returnCarpark)}, bay ${escapeHTML(booking.bay)}</dd></div>`;
  }

  return `
    <article class="booking-card${doneClass}">
      <div class="booking-head">
        <img src="${car.image}" alt="${car.name}" class="booking-img">
        <div class="booking-info">
          <p class="booking-ref">${escapeHTML(booking.ref)}</p>
          <h2 class="booking-car">${car.name}</h2>
          <span class="status ${statusClass[booking.status]}">${statusText[booking.status]}</span>
        </div>
      </div>
      ${makeTracker(booking.status)}
      <dl class="booking-details">
        <div class="detail"><dt>Pick-up branch</dt><dd>AZoom - ${escapeHTML(booking.branch)}</dd></div>
        <div class="detail"><dt>Pick-up date</dt><dd>${formatDate(booking.pickupDate)}</dd></div>
        <div class="detail"><dt>Period</dt><dd>${formatPeriod(booking.duration, booking.period)}</dd></div>
        <div class="detail"><dt>Return car park</dt><dd>${escapeHTML(booking.carpark)}</dd></div>
        <div class="detail"><dt>Paid</dt><dd>$${booking.rental} + $${booking.deposit} deposit</dd></div>
        ${returnInfo}
      </dl>
      ${makeActionPart(booking)}
    </article>
  `;
}

// ---------- 6. Show all bookings of this customer ----------
function displayBookings() {
  const user = getCurrentUser();

  // not logged in -> ask the user to log in
  if (user === null || user.role !== "customer") {
    userNameText.textContent = "Guest";
    bookingList.innerHTML = `
      <div class="booking-card">
        <h2 class="booking-car">Please log in</h2>
        <p class="action-hint">Log in as a customer to see your bookings.</p>
        <a href="login.html" class="btn">Go to Login</a>
      </div>
    `;
    return;
  }

  userNameText.textContent = user.name;

  // keep only this customer's bookings
  const myBookings = getBookings().filter(function (booking) {
    return booking.email === user.email;
  });

  if (myBookings.length === 0) {
    bookingList.innerHTML = `
      <div class="booking-card">
        <h2 class="booking-car">No bookings yet</h2>
        <p class="action-hint">Choose a premium electric car and start your journey.</p>
        <a href="reserve.html" class="btn">Reserve Your Car</a>
      </div>
    `;
    return;
  }

  // newest booking first
  myBookings.reverse();

  let html = "";
  for (const booking of myBookings) {
    html += makeBookingCard(booking);
  }
  bookingList.innerHTML = html;
}

// ---------- 7. Change the status of one booking and save ----------
function changeBooking(ref, changes) {
  const bookings = getBookings();
  const booking = findBooking(bookings, ref);

  // copy every changed value into the booking
  for (const key in changes) {
    booking[key] = changes[key];
  }

  saveBookings(bookings);
  displayBookings();
}

// ---------- 8. Buttons: Pick Up and Cancel ----------
// one click listener for the whole list (the cards are made by JavaScript)
bookingList.addEventListener("click", function (event) {
  const button = event.target;
  const ref = button.dataset.ref;

  if (button.classList.contains("pickup-btn")) {
    changeBooking(ref, { status: "picked" });
  }

  if (button.classList.contains("cancel-btn")) {
    const sure = confirm("Cancel booking " + ref + "?");
    if (sure === true) {
      changeBooking(ref, { status: "cancelled" });
    }
  }
});

// ---------- 9. Forms: Return Car and Pay Final Bill ----------
bookingList.addEventListener("submit", function (event) {
  event.preventDefault();
  const form = event.target;
  const ref = form.dataset.ref;

  if (form.classList.contains("return-form")) {
    const carpark = form.querySelector(".return-park").value;
    const bay = form.querySelector(".return-bay").value.trim().toUpperCase();
    changeBooking(ref, { status: "returned", returnCarpark: carpark, bay: bay });
  }

  if (form.classList.contains("pay-form")) {
    changeBooking(ref, { status: "paid" });
  }
});

// ---------- 10. When the page opens ----------
displayBookings();
