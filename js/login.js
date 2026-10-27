// ===== AZoom Car Rental - Login page =====
// 1. Log in as a customer or a staff member (check email + password in the "users" array)
// 2. Create a new customer account

// ---------- 1. Get the HTML elements ----------
const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#login-email");
const passwordInput = document.querySelector("#login-password");
const loginError = document.querySelector("#login-error");

const registerForm = document.querySelector("#register-form");
const regName = document.querySelector("#reg-name");
const regEmail = document.querySelector("#reg-email");
const regPassword = document.querySelector("#reg-password");
const regConfirm = document.querySelector("#reg-confirm");
const registerError = document.querySelector("#register-error");

// ---------- 2. Which role is chosen? (Customer or Staff) ----------
function getChosenRole() {
  const chosen = document.querySelector('input[name="role"]:checked');
  return chosen.value;
}

// ---------- 3. Change the email hint when the user switches role ----------
const roleInputs = document.querySelectorAll('input[name="role"]');
for (const input of roleInputs) {
  input.addEventListener("change", function () {
    if (getChosenRole() === "staff") {
      emailInput.placeholder = "staff@azoom.com";
    } else {
      emailInput.placeholder = "customer@azoom.com";
    }
    loginError.textContent = "";
  });
}

// ---------- 4. Save the user and go to the right page ----------
function loginAs(user) {
  const userToSave = {
    name: user.name,
    email: user.email,
    role: user.role
  };
  localStorage.setItem("azoomUser", JSON.stringify(userToSave));

  if (user.role === "staff") {
    window.location.href = "staff.html";
  } else {
    window.location.href = "bookings.html";
  }
}

// ---------- 5. Login form ----------
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();             // stop the page from reloading

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const role = getChosenRole();

  // look for a user with the same email, password and role
  let foundUser = null;
  for (const user of getAllUsers()) {
    if (user.email === email && user.password === password && user.role === role) {
      foundUser = user;
    }
  }

  if (foundUser === null) {
    loginError.textContent = "Wrong email or password. Please check and try again.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  loginAs(foundUser);
});

// clear the error message when the user types again
emailInput.addEventListener("input", function () {
  loginError.textContent = "";
});
passwordInput.addEventListener("input", function () {
  loginError.textContent = "";
});

// ---------- 6. Create account form ----------
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = regName.value.trim();
  const email = regEmail.value.trim().toLowerCase();
  const password = regPassword.value;
  const confirm = regConfirm.value;

  // check 1: the two passwords must be the same
  if (password !== confirm) {
    registerError.textContent = "The two passwords are not the same.";
    return;
  }

  // check 2: the email must not be used already
  for (const user of getAllUsers()) {
    if (user.email === email) {
      registerError.textContent = "This email already has an account. Please log in.";
      return;
    }
  }

  // save the new customer
  const newUser = {
    email: email,
    password: password,
    role: "customer",
    name: name
  };

  const saved = localStorage.getItem("azoomNewUsers");
  let newUsers = [];
  if (saved !== null) {
    newUsers = JSON.parse(saved);
  }
  newUsers.push(newUser);
  localStorage.setItem("azoomNewUsers", JSON.stringify(newUsers));

  loginAs(newUser);
});
