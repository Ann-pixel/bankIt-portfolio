"use strict";
// Data
const account1 = {
  owner: "John Doe",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Mary Poppins",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "John Markson",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Mark Johnson",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

function updateUI(account) {
  displayMovements(account.movements);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
}
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, idx) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = ` 
    <div class="movements__row">
    <div class="movements__type movements__type--deposit">${
      idx + 1
    } ${type}</div>
    
    <div class="movements__value">${mov} €</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

function calcDisplayBalance(acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} €`;
  acc.balance = balance;
}

function calcDisplaySummary(acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;
  const withdrawals = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = withdrawals;
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest} €`;
}

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
//event handlers

let currentAcc;

btnLogin.addEventListener("click", function (evt) {
  evt.preventDefault();
  currentAcc = accounts.find(
    (acc) =>
      acc.userName === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );
  if (!currentAcc) alert("incorrect user name or pin");
  if (currentAcc) {
    labelWelcome.textContent = `Welcome back, ${
      currentAcc.owner.split(" ")[0]
    }!`;
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    updateUI(currentAcc);
    containerApp.style.opacity = 100;
  }
});
btnTransfer.addEventListener("click", function (evt) {
  evt.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = "";

  if (
    amount > 0 &&
    recieverAcc &&
    amount <= currentAcc.balance &&
    recieverAcc?.userName !== currentAcc.userName
  ) {
    currentAcc.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAcc);
  } else {
    alert("transfer not possible.");
  }
});

btnLoan.addEventListener("click", function (evt) {
  evt.preventDefault();
  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value = "";
  if (amount > 0 && currentAcc.movements.some((mov) => mov >= amount / 10)) {
    currentAcc.movements.push(amount);
    updateUI(currentAcc);
  } else {
    alert("cannot process loan");
  }
});

btnClose.addEventListener("click", function (evt) {
  evt.preventDefault();
  if (
    inputCloseUsername.value === currentAcc.userName &&
    Number(inputClosePin.value) === currentAcc.pin
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
  displayMovements(currentAcc.movements, sorted);
});
