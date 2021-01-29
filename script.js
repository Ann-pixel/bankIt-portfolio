"use strict";
// Data
const account1 = {
  owner: "John Doe",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2021-01-28T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2021-01-23T14:11:59.604Z",
    "2021-01-26T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2021-01-27T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "es-ES", // de-DE
};

const account2 = {
  owner: "Mary Poppins",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
function createUserNames(accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
}
createUserNames(accounts);

function updateUI(account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
}
function formatMovementDate(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, "0");
    // const month = `${date.getMonth() + 1}`.padStart(2, "0");
    // const year = date.getFullYear();
    // return `${month}/${day}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
}
function formatCurrency(num, acc) {
  return new Intl.NumberFormat(acc.locale, {
    style: "currency",
    currency: acc.currency,
  }).format(num);
}
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, idx) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[idx]);
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMovement = formatCurrency(mov, acc);
    const html = ` 
    <div class="movements__row">
    <div class="movements__type movements__type--deposit">${
      idx + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formattedMovement}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

function calcDisplayBalance(acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0).toFixed(2);
  const formattedBalance = formatCurrency(balance, acc);
  labelBalance.textContent = `${formattedBalance}`;
  acc.balance = balance;
}

function calcDisplaySummary(acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0)
    .toFixed(2);
  const formattedIncome = formatCurrency(incomes, acc);
  labelSumIn.textContent = `${formattedIncome}`;
  const withdrawals = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0)
    .toFixed(2);
  const formattedWithdrawals = formatCurrency(withdrawals, acc);
  labelSumOut.textContent = `${formattedWithdrawals}`;
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, interest) => acc + interest, 0)
    .toFixed(2);
  const formattedInterest = formatCurrency(interest, acc);
  labelSumInterest.textContent = `${formattedInterest}`;
}
function startLogOutTimer() {
  let time = 300;
  function tick() {
    const min = String(Math.trunc(time / 60)).padStart(2, "0");
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(logOutTimer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 100;
    }
    time--;
  }
  tick();
  const logOutTimer = setInterval(tick, 1000);
  return logOutTimer;
}
let currentAcc, timer;
// fake constant login:
// currentAcc = account1;
// updateUI(currentAcc);
// containerApp.style.opacity = 100;

//event handlers

btnLogin.addEventListener("click", function (evt) {
  evt.preventDefault();
  currentAcc = accounts.find(
    (acc) =>
      acc.userName === inputLoginUsername.value &&
      acc.pin === +inputLoginPin.value
  );
  if (!currentAcc) alert("incorrect user name or pin");
  if (currentAcc) {
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(" ")[0]
    }!`;
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    updateUI(currentAcc);
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    containerApp.style.opacity = 100;
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: "short",
    };
    // const locale = navigator.language; //instead of specifying "en-US" etc. get locale from client's browser
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAcc.locale,
      options
    ).format(now);
  }
});
btnTransfer.addEventListener("click", function (evt) {
  evt.preventDefault();
  const amount = +inputTransferAmount.value;
  const recieverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = "";
  clearInterval(timer);
  timer = startLogOutTimer();
  if (
    amount > 0 &&
    recieverAcc &&
    amount <= currentAcc.balance &&
    recieverAcc?.userName !== currentAcc.userName
  ) {
    currentAcc.movements.push(-amount);
    recieverAcc.movements.push(amount);
    currentAcc.movementsDates.push(new Date().toISOString());
    recieverAcc.movementsDates.push(new Date().toISOString());
    updateUI(currentAcc);
  } else {
    alert("transfer not possible.");
  }
  //add transfer date:
});

btnLoan.addEventListener("click", function (evt) {
  evt.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  inputLoanAmount.value = "";
  clearInterval(timer);
  timer = startLogOutTimer();
  setTimeout(function () {
    if (amount > 0 && currentAcc.movements.some((mov) => mov >= amount / 10)) {
      currentAcc.movements.push(amount);
      currentAcc.movementsDates.push(new Date().toISOString());
      updateUI(currentAcc);
    } else {
      alert("cannot process loan");
    }
  }, 2000);
});

btnClose.addEventListener("click", function (evt) {
  evt.preventDefault();
  if (
    inputCloseUsername.value === currentAcc.userName &&
    +inputClosePin.value === currentAcc.pin
  ) {
    const idx = accounts.findIndex(
      (acc) => acc.userName === currentAcc.userName
    );

    accounts.splice(idx, 1);
    containerApp.style.opacity = 0;
  } else {
    alert("cannot close account");
  }
  inputClosePin.value = inputCloseUsername.value = "";
});
let sorted = false;
btnSort.addEventListener("click", function (evt) {
  evt.preventDefault();
  sorted = !sorted;
  displayMovements(currentAcc, sorted);
});
