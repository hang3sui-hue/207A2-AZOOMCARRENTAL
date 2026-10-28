// ===== AZoom Car Rental - Reserve page =====
// 1. Fill the car list from the "cars" array
// 2. Work out the price while the customer fills in the form
// 3. Check the credit card details
// 4. Save the booking and show the confirmation pop-up

// ---------- 1. Get the HTML elements ----------
const reserveForm = document.querySelector("#reserve-form");
const carSelect = document.querySelector("#car-select");
const branchSelect = document.querySelector("#pickup-branch");
const dateInput = document.querySelector("#pickup-date");
const durationInput = document.querySelector("#duration");
const carparkSelect = document.querySelector("#return-carpark");
const nameInput = document.querySelector("#full-name");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const licenceInput = document.querySelector("#licence");
const cardNumberInput = document.querySelector("#card-number");
const cardExpiryInput = document.querySelector("#card-expiry");
const cardCvvInput = document.querySelector("#card-cvv");
const termsBox = document.querySelector("#terms");
const formError = document.querySelector("#form-error");

const summaryImg = document.querySelector("#summary-img");
const sumCar = document.querySelector("#sum-car");
const sumBranch = document.querySelector("#sum-branch");
const sumDate = document.querySelector("#sum-date");
const sumPeriod = document.querySelector("#sum-period");
const sumCarpark = document.querySelector("#sum-carpark");
const sumRental = document.querySelector("#sum-rental");
const sumTotal = document.querySelector("#sum-total");

const confirmDialog = document.querySelector("#confirm-dialog");
const bookingRefText = document.querySelector("#booking-ref");
const closeDialogButton = document.querySelector("#close-dialog");

const DEPOSIT = 500;

// ---------- 2. Fill the car drop-down (only cars that can be rented) ----------
// cars marked "repair" or "cleaning" by staff are left out
function fillCarOptions() {
  let html = `<option value="">-- Please choose a car --</option>`;
  for (const car of cars) {
    if (canBeRented(car)) {
      html += `<option value="${car.id}">${car.name} - ${car.type} - $${car.pricePerDay} / day</option>`;
    }
  }
  carSelect.innerHTML = html;
}

// ---------- 3. Which rental period is chosen? (day / week / month) ----------
function getChosenPeriod() {
  return getCheckedValue("period");   // in data.js
}

// ---------- 4. Work out the rental cost ----------
function getRentalCost() {
  const car = findCar(carSelect.value);
  if (car === null) {
    return 0;
  }

  const period = getChosenPeriod();
  const duration = Number(durationInput.value);

  // "day" -> car.pricePerDay, "week" -> car.pricePerWeek, "month" -> car.pricePerMonth
  const priceNames = { day: "pricePerDay", week: "pricePerWeek", month: "pricePerMonth" };
  return car[priceNames[period]] * duration;
}

// ---------- 5. Update the Booking Summary box ----------
// show a value in the summary, or "-" when nothing is chosen yet
function showValue(element, value) {
  if (value === "") {
    element.textContent = "-";
  } else {
    element.textContent = value;
  }
}

function updateSummary() {
  const car = findCar(carSelect.value);

  if (car === null) {
    sumCar.textContent = "-";
  } else {
    sumCar.textContent = car.name;
    summaryImg.src = car.image;
    summaryImg.alt = car.name;
  }

  showValue(sumBranch, branchSelect.value);

  sumDate.textContent = formatDate(dateInput.value);
  sumPeriod.textContent = formatPeriod(Number(durationInput.value), getChosenPeriod());

  showValue(sumCarpark, carparkSelect.value);

  const rental = getRentalCost();
  sumRental.textContent = "$" + rental;
  sumTotal.textContent = "$" + (rental + DEPOSIT);
}

// update the summary every time the customer changes something
reserveForm.addEventListener("input", updateSummary);
reserveForm.addEventListener("change", updateSummary);

// ---------- 6. Make the card number easy to read: 1234 5678 9012 3456 ----------
cardNumberInput.addEventListener("input", function () {
  const digits = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);   // keep numbers only
  let groups = [];
  for (let i = 0; i < digits.length; i = i + 4) {
    groups.push(digits.slice(i, i + 4));
  }
  cardNumberInput.value = groups.join(" ");
});

// add the "/" in the expiry date automatically: 0829 -> 08/29
cardExpiryInput.addEventListener("input", function () {
  const digits = cardExpiryInput.value.replace(/\D/g, "").slice(0, 4);
  if (digits.length > 2) {
    cardExpiryInput.value = digits.slice(0, 2) + "/" + digits.slice(2);
  } else {
    cardExpiryInput.value = digits;
  }
});

// CVV: numbers only
cardCvvInput.addEventListener("input", function () {
  cardCvvInput.value = cardCvvInput.value.replace(/\D/g, "").slice(0, 4);
});

// ---------- 7. Check the credit card ----------
// returns an error message, or "" if everything is OK
function checkCard() {
  const cardDigits = cardNumberInput.value.replace(/\D/g, "");
  if (cardDigits.length !== 16) {
    return "The card number must have 16 numbers.";
  }

  const expiry = cardExpiryInput.value;
  if (expiry.length !== 5) {
    return "Please enter the expiry date like this: MM/YY.";
  }

  const month = Number(expiry.slice(0, 2));
  const year = 2000 + Number(expiry.slice(3, 5));
  if (month < 1 || month > 12) {
    return "The expiry month must be from 01 to 12.";
  }

  // the card works until the end of the expiry month
  const today = new Date();
  const endOfExpiryMonth = new Date(year, month, 1);
  if (endOfExpiryMonth <= today) {
    return "This card has expired. Please use another card.";
  }

  if (cardCvvInput.value.length < 3) {
    return "The CVV must have 3 or 4 numbers.";
  }

  return "";
}

// ---------- 8. Make a new booking number, like AZ-1032 ----------
function makeBookingRef(list) {
  let biggest = 1000;
  for (const booking of list) {
    const number = Number(booking.ref.replace("AZ-", ""));
    if (number > biggest) {
      biggest = number;
    }
  }
  return "AZ-" + (biggest + 1);
}

// ---------- 9. When the customer clicks "Confirm and Pay" ----------
reserveForm.addEventListener("submit", function (event) {
  event.preventDefault();
  formError.textContent = "";

  // the customer must log in first
  const user = getCurrentUser();
  if (user === null || user.role !== "customer") {
    formError.innerHTML = `Please <a href="login.html" class="text-link">log in as a customer</a> before you reserve a car.`;
    return;
  }

  // check the credit card
  const cardMessage = checkCard();
  if (cardMessage !== "") {
    formError.textContent = cardMessage;
    return;
  }

  // the pick-up date cannot be in the past (local date, not UTC)
  if (dateInput.value < todayText()) {
    formError.textContent = "The pick-up date cannot be in the past.";
    return;
  }

  // the car must still be free to rent
  const car = findCar(carSelect.value);
  if (car === null || canBeRented(car) === false) {
    formError.textContent = "Sorry, this car cannot be booked right now. Please choose another car.";
    fillCarOptions();
    return;
  }

  // the car must not be booked by someone else on the same days
  const returnDate = addDays(dateInput.value, rentalDays(getChosenPeriod(), Number(durationInput.value)));
  const clash = findClash(car.id, dateInput.value, returnDate);
  if (clash !== null) {
    formError.textContent = car.name + " is already booked from " + formatDate(clash.pickupDate) +
      " to " + formatDate(getReturnDate(clash)) + ". Please choose other dates or another car.";
    return;
  }

  // save the booking
  const bookings = getBookings();
  const newBooking = {
    ref: makeBookingRef(bookings),
    name: nameInput.value.trim(),
    email: user.email,
    phone: phoneInput.value.trim(),
    licence: licenceInput.value.trim().toUpperCase(),
    carId: Number(carSelect.value),
    branch: branchSelect.value,
    pickupDate: dateInput.value,
    period: getChosenPeriod(),
    duration: Number(durationInput.value),
    carpark: carparkSelect.value,
    rental: getRentalCost(),
    deposit: DEPOSIT,
    status: "reserved",
    returnCarpark: "",
    bay: "",
    damages: [],
    extra: 0,
    notes: ""
  };
  bookings.push(newBooking);
  saveBookings(bookings);

  // show the pop-up
  bookingRefText.textContent = newBooking.ref;
  confirmDialog.showModal();
});

closeDialogButton.addEventListener("click", function () {
  confirmDialog.close();
});

// ---------- 10. When the page opens ----------
fillCarOptions();

// the earliest pick-up date is today
dateInput.min = todayText();

// if the customer clicked "Reserve" on the Cars page, choose that car (reserve.html?car=3)
const pageAddress = new URLSearchParams(window.location.search);
const carFromCarsPage = pageAddress.get("car");
if (carFromCarsPage !== null) {
  carSelect.value = carFromCarsPage;
  // the car is not in the list (booked out or in service)
  if (carSelect.value === "") {
    formError.textContent = "Sorry, that car cannot be booked right now. Please choose another car.";
  }
}

// if the customer is logged in, fill in the name and email for them
const loggedInUser = getCurrentUser();
if (loggedInUser !== null && loggedInUser.role === "customer") {
  nameInput.value = loggedInUser.name;
  emailInput.value = loggedInUser.email;
}

updateSummary();
