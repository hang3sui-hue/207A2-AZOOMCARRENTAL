// ===== AZoom Car Rental - Cars page =====
// Shows the cars from the "cars" array (in data.js) as cards,
// and lets the user filter by type and branch, and sort by price.

// 1. Get the HTML elements we need
const carList = document.querySelector("#car-list");
const typeFilter = document.querySelector("#type-filter");
const branchFilter = document.querySelector("#branch-filter");
const sortSelect = document.querySelector("#sort-select");
const resultCount = document.querySelector("#result-count");

// 2. Fill the "type" drop-down with every car type (no duplicates)
function fillTypeOptions() {
  const types = [];
  for (const car of cars) {
    if (!types.includes(car.type)) {
      types.push(car.type);
    }
  }
  for (const type of types) {
    typeFilter.innerHTML += `<option value="${type}">${type}</option>`;
  }
}

// 3. Fill the "branch" drop-down from the branches array
function fillBranchOptions() {
  for (const branch of branches) {
    branchFilter.innerHTML += `<option value="${branch}">${branch}</option>`;
  }
}

// 4. Make the HTML for ONE car card
function makeCarCard(car) {
  // different badge and button if the car is not available
  let badge = `<span class="badge badge-available">Available</span>`;
  let button = `<a href="reserve.html?car=${car.id}" class="btn">Reserve</a>`;

  if (car.available === false) {
    badge = `<span class="badge badge-booked">Booked</span>`;
    button = `<span class="btn btn-disabled">Not Available</span>`;
  }

  return `
    <div class="fleet-card car-card">
      <div class="car-img-box">
        <img src="${car.image}" alt="${car.name}, ${car.type}" class="fleet-img">
        ${badge}
      </div>
      <h3 class="fleet-name">${car.name}</h3>
      <p class="fleet-type">${car.type} · ${car.seats} seats · ${car.range} km range</p>
      <p class="car-branch">${car.branch}</p>
      <ul class="car-prices">
        <li><span class="price">$${car.pricePerDay}</span> / day</li>
        <li><span class="price-small">$${car.pricePerWeek}</span> / week</li>
        <li><span class="price-small">$${car.pricePerMonth}</span> / month</li>
      </ul>
      <div class="car-action">${button}</div>
    </div>
  `;
}

// 5. Show a list of cars on the page
function displayCars(list) {
  if (list.length === 0) {
    carList.innerHTML = `<p class="no-result">No cars match your choice. Please try another filter.</p>`;
  } else {
    let html = "";
    for (const car of list) {
      html += makeCarCard(car);
    }
    carList.innerHTML = html;
  }
  resultCount.textContent = `${list.length} car(s) found`;
}

// 6. Filter and sort, then show the result
function updateCars() {
  // filter() keeps only the cars that pass the test
  let result = cars.filter(function (car) {
    const typeOK = typeFilter.value === "all" || car.type === typeFilter.value;
    const branchOK = branchFilter.value === "all" || car.branch === branchFilter.value;
    return typeOK && branchOK;
  });

  // sort() puts the cars in order of price
  if (sortSelect.value === "low") {
    result.sort(function (a, b) { return a.pricePerDay - b.pricePerDay; });
  } else if (sortSelect.value === "high") {
    result.sort(function (a, b) { return b.pricePerDay - a.pricePerDay; });
  }

  displayCars(result);
}

// 7. Run updateCars() every time the user changes a drop-down
typeFilter.addEventListener("change", updateCars);
branchFilter.addEventListener("change", updateCars);
sortSelect.addEventListener("change", updateCars);

// 8. When the page opens: fill the drop-downs and show all cars
fillTypeOptions();
fillBranchOptions();
displayCars(cars);
