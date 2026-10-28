// ===== AZoom Car Rental - shared data =====
// All data is stored in JavaScript arrays (no back-end database is needed).
// Every page that needs car or branch data loads this file first.

// Our two branches
const branches = ["King Branch", "Queen Branch"];

// Our cars - an array of objects (like Practical 2)
const cars = [
  {
    id: 1,
    name: "AZoom Aurora",
    type: "Hypercar",
    seats: 2,
    range: 480,                // driving range in km on one charge
    pricePerDay: 199,
    pricePerWeek: 1190,
    pricePerMonth: 3990,
    branch: "King Branch",
    image: "images/car-1.jpg",
    available: true
  },
  {
    id: 2,
    name: "AZoom Noir GT",
    type: "Grand Tourer",
    seats: 4,
    range: 620,
    pricePerDay: 149,
    pricePerWeek: 890,
    pricePerMonth: 2990,
    branch: "Queen Branch",
    image: "images/car-2.jpg",
    available: true
  },
  {
    id: 3,
    name: "AZoom Celeste",
    type: "SUV",
    seats: 7,
    range: 550,
    pricePerDay: 139,
    pricePerWeek: 830,
    pricePerMonth: 2790,
    branch: "King Branch",
    image: "images/car-3.jpg",
    available: true
  },
  {
    id: 4,
    name: "AZoom Verde",
    type: "Coupe",
    seats: 2,
    range: 510,
    pricePerDay: 129,
    pricePerWeek: 770,
    pricePerMonth: 2590,
    branch: "Queen Branch",
    image: "images/car-4.jpg",
    available: false
  },
  {
    id: 5,
    name: "AZoom Volt S",
    type: "Sedan",
    seats: 5,
    range: 600,
    pricePerDay: 99,
    pricePerWeek: 590,
    pricePerMonth: 1990,
    branch: "King Branch",
    image: "images/car-5.jpg",
    available: true
  },
  {
    id: 6,
    name: "AZoom Breeze",
    type: "Convertible",
    seats: 2,
    range: 430,
    pricePerDay: 169,
    pricePerWeek: 1010,
    pricePerMonth: 3390,
    branch: "Queen Branch",
    image: "images/car-6.jpg",
    available: true
  },
  {
    id: 7,
    name: "AZoom Summit",
    type: "SUV",
    seats: 5,
    range: 580,
    pricePerDay: 119,
    pricePerWeek: 710,
    pricePerMonth: 2390,
    branch: "Queen Branch",
    image: "images/car-7.jpg",
    available: true
  },
  {
    id: 8,
    name: "AZoom Pulse",
    type: "Hatchback",
    seats: 4,
    range: 420,
    pricePerDay: 79,
    pricePerWeek: 470,
    pricePerMonth: 1590,
    branch: "King Branch",
    image: "images/car-8.jpg",
    available: true
  }
];

// ===== Users (for the login page) =====
// Demo accounts. New accounts from the sign-up form are saved in localStorage.
const users = [
  {
    email: "customer@azoom.com",
    password: "1234",
    role: "customer",
    name: "Jack Tan"
  },
  {
    email: "staff@azoom.com",
    password: "1234",
    role: "staff",
    name: "Emily Ong"
  }
];

// ===== Sample bookings =====
// Used the first time the website opens. After that, bookings are saved in localStorage,
// so a new booking on the Reserve page also shows on My Bookings and on the Staff Portal.
// status can be: "reserved" > "picked" > "returned" > "inspected" > "paid"  (or "cancelled")
const sampleBookings = [
  {
    ref: "AZ-1031", name: "Jack Tan", email: "customer@azoom.com", carId: 1,
    branch: "King Branch", pickupDate: "2026-11-02", period: "day", duration: 3,
    carpark: "King Road Car Park", rental: 597, deposit: 500,
    status: "reserved", returnCarpark: "", bay: "", damages: [], extra: 0, notes: ""
  },
  {
    ref: "AZ-1027", name: "Jack Tan", email: "customer@azoom.com", carId: 3,
    branch: "Queen Branch", pickupDate: "2026-10-20", period: "week", duration: 1,
    carpark: "Queen Road Car Park", rental: 830, deposit: 500,
    status: "picked", returnCarpark: "", bay: "", damages: [], extra: 0, notes: ""
  },
  {
    ref: "AZ-1025", name: "Mia Lim", email: "mia@example.com", carId: 7,
    branch: "Queen Branch", pickupDate: "2026-10-18", period: "week", duration: 1,
    carpark: "Queen Road Car Park", rental: 710, deposit: 500,
    status: "returned", returnCarpark: "Queen Road Car Park", bay: "L1-08", damages: [], extra: 0, notes: ""
  },
  {
    ref: "AZ-1022", name: "Ravi Kumar", email: "ravi@example.com", carId: 6,
    branch: "King Branch", pickupDate: "2026-10-15", period: "week", duration: 1,
    carpark: "King Road Car Park", rental: 1010, deposit: 500,
    status: "returned", returnCarpark: "King Road Car Park", bay: "B1-17", damages: [], extra: 0, notes: ""
  },
  {
    ref: "AZ-1019", name: "Jack Tan", email: "customer@azoom.com", carId: 2,
    branch: "Queen Branch", pickupDate: "2026-10-11", period: "week", duration: 1,
    carpark: "Queen Road Car Park", rental: 890, deposit: 500,
    status: "inspected", returnCarpark: "Queen Road Car Park", bay: "L1-02",
    damages: [
      { name: "Scratch on body", fee: 150 },
      { name: "Battery below 20%", fee: 50 }
    ],
    extra: 200, notes: "Small scratch on the rear door."
  },
  {
    ref: "AZ-1008", name: "Jack Tan", email: "customer@azoom.com", carId: 5,
    branch: "King Branch", pickupDate: "2026-10-01", period: "day", duration: 2,
    carpark: "King Road Car Park", rental: 198, deposit: 500,
    status: "paid", returnCarpark: "King Road Car Park", bay: "B1-03", damages: [], extra: 0, notes: ""
  }
];

// ===== Text and colour for each booking status =====
const statusText = {
  reserved: "Reserved",
  picked: "Picked Up",
  returned: "Returned",
  inspected: "Bill Ready",
  paid: "Completed",
  cancelled: "Cancelled"
};

const statusClass = {
  reserved: "status-reserved",
  picked: "status-rented",
  returned: "status-returned",
  inspected: "status-bill",
  paid: "status-paid",
  cancelled: "status-cancelled"
};

// ===== Helper functions (used by many pages) =====

// read a value from localStorage (or give back the default if nothing is saved yet)
// if the saved text is broken, the default is used instead of crashing the page
function loadData(key, defaultValue) {
  const saved = localStorage.getItem(key);
  if (saved === null) {
    return defaultValue;
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    return defaultValue;
  }
}

// save a value in localStorage as JSON text
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// all bookings (the sample bookings the first time the site opens)
function getBookings() {
  return loadData("azoomBookings", sampleBookings);
}

function saveBookings(list) {
  saveData("azoomBookings", list);
}

// change some fields of one booking and save, e.g. updateBooking("AZ-1031", { status: "picked" })
function updateBooking(ref, changes) {
  const bookings = getBookings();
  const booking = findBooking(bookings, ref);
  if (booking === null) {
    return;
  }
  for (const key in changes) {
    booking[key] = changes[key];
  }
  saveBookings(bookings);
}

// find one booking by its booking number
function findBooking(list, ref) {
  for (const booking of list) {
    if (booking.ref === ref) {
      return booking;
    }
  }
  return null;
}

// find one car by its id
function findCar(id) {
  for (const car of cars) {
    if (car.id === Number(id)) {
      return car;
    }
  }
  return null;
}

// the user who is logged in (or null)
function getCurrentUser() {
  return loadData("azoomUser", null);
}

// all users: demo users + users who signed up on this browser
function getAllUsers() {
  return users.concat(loadData("azoomNewUsers", []));
}

// add a user from the sign-up form
function saveNewUser(user) {
  const newUsers = loadData("azoomNewUsers", []);
  newUsers.push(user);
  saveData("azoomNewUsers", newUsers);
}

// the value of the chosen radio button in a group, e.g. getCheckedValue("period") -> "week"
function getCheckedValue(groupName) {
  return document.querySelector('input[name="' + groupName + '"]:checked').value;
}

// make text safe before putting it into innerHTML
// (so a name like <img onerror=...> shows as text and does not run as code)
function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ===== Dates =====
// Dates are kept as "YYYY-MM-DD" text in the LOCAL time zone (Singapore),
// not with toISOString(), which gives the UTC date and can be one day behind.

// Date object -> "2026-11-02"
function toDateText(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// "2026-11-02" -> Date object at local midnight
function parseDate(text) {
  const parts = text.split("-");
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

// today's date as "YYYY-MM-DD"
function todayText() {
  return toDateText(new Date());
}

// "2026-11-02" + 3 days -> "2026-11-05"
function addDays(text, days) {
  const date = parseDate(text);
  date.setDate(date.getDate() + days);
  return toDateText(date);
}

// how many days a rental lasts
function rentalDays(period, duration) {
  if (period === "week") {
    return duration * 7;
  }
  if (period === "month") {
    return duration * 30;
  }
  return duration;
}

// the day the car should come back
function getReturnDate(booking) {
  return addDays(booking.pickupDate, rentalDays(booking.period, booking.duration));
}

// "2026-11-02" -> "2 Nov 2026"
function formatDate(text) {
  if (text === "" || text === undefined) {
    return "-";
  }
  return parseDate(text).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });
}

// ===== Car availability =====
// After an inspection, staff can mark a car "repair" or "cleaning".
// Those cars cannot be booked until staff mark them ready again.

function getCarStatuses() {
  return loadData("azoomCarStatus", {});
}

function setCarStatus(carId, status) {
  const statuses = getCarStatuses();
  if (status === "available") {
    delete statuses[carId];
  } else {
    statuses[carId] = status;
  }
  saveData("azoomCarStatus", statuses);
}

// "available", "repair" or "cleaning"
function getCarStatus(carId) {
  const status = getCarStatuses()[carId];
  if (status === undefined) {
    return "available";
  }
  return status;
}

// can this car be offered to customers at all?
function canBeRented(car) {
  return car.available === true && getCarStatus(car.id) === "available";
}

// find a booking that already uses this car between start and end (or null)
// - reserved: blocks its own dates
// - picked / returned: the car is not back or not checked yet, so it is busy until at least tomorrow
function findClash(carId, start, end) {
  const tomorrow = addDays(todayText(), 1);

  for (const booking of getBookings()) {
    if (booking.carId !== Number(carId)) {
      continue;
    }
    if (booking.status !== "reserved" && booking.status !== "picked" && booking.status !== "returned") {
      continue;
    }

    let busyUntil = getReturnDate(booking);
    if (booking.status !== "reserved" && busyUntil < tomorrow) {
      busyUntil = tomorrow;
    }

    // two date ranges overlap when each one starts before the other one ends
    if (start < busyUntil && booking.pickupDate < end) {
      return booking;
    }
  }
  return null;
}

// 3, "day" -> "3 days"
function formatPeriod(duration, period) {
  let text = duration + " " + period;
  if (duration > 1) {
    text = text + "s";
  }
  return text;
}

// ===== Navigation bar: show "Logout" when someone is logged in =====
function updateNav() {
  const loginLink = document.querySelector("nav .Login");
  const user = getCurrentUser();

  if (loginLink === null || user === null) {
    return;
  }

  loginLink.textContent = "Logout";
  loginLink.title = "Logged in as " + user.name;

  loginLink.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.removeItem("azoomUser");
    window.location.href = "index.html";
  });
}

updateNav();
