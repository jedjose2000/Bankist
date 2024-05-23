'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcPrintBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);

  const outcomes = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(value => (value * account.interestRate) / 100)
    .filter(value => value >= 1)
    .reduce((acc, curr) => acc + curr, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(userVal => userVal[0])
      .join('');
  });
};

const updateUI = function (acc) {
  // display movements
  displayMovements(acc.movements);

  // display balance
  calcDisplaySummary(acc);

  // display summary
  calcPrintBalance(acc);
};

createUserNames(accounts);

let currentAccount;

// EVENT HANDLERS

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  if (currentAccount) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    updateUI(currentAccount);

    // clear login fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    account => account.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiver &&
    currentAccount.balance >= amount &&
    receiver?.username !== currentAccount.username
  ) {
    // refresh page
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    inputLoanAmount.value = '';
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      value => value.username === currentAccount.username
    );
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = '';
    accounts.splice(index, 1);
  }
});

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e', 'f'];

// // slice returns a shallow copy
// console.log(arr.slice(2));
// console.log(arr);

// // splice mutates the original array
// console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);

// // reverse
// arr = ['a', 'b', 'c', 'd', 'e', 'f'];
// const arr2 = ['f', 'i', 'j', 'j', 'g'];
// console.log(arr2.reverse());
// console.log(arr2);

// // concat
// const letters = arr.concat(arr2);
// console.log([...arr, ...arr2]);
// console.log(letters);

// // join
// console.log(letters.join('-'));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// // getting the last element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// console.log('jonas'.at(0));

// for (const [index, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${index}: You deposited ${movement}`);
//   } else {

//     console.log(`Movement ${index}: You withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('------------------');
// movements.forEach(function (movement, index, array) {
//   if (movement > 0) {
//     console.log(`Movement ${index}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${index}: You withdrew ${Math.abs(movement)}`);
//   }
// });

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, _, set) {
//   console.log(`${value}: ${value}`);
// });

// const typeDogs = function (arrayDog) {
//   arrayDog.forEach(function (dogAge, index) {
//     if (dogAge >= 3) {
//       console.log(
//         `Dog number ${index + 1} is an adult, and is ${dogAge} years old`
//       );
//     } else {
//       console.log(`Dog number ${index + 1} is still a puppy`);
//     }
//   });
// };

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUsd);
// }

// console.log(movementsUSDfor);

// const movementsDescriptions = movements.map((movement, index) => {
//   return `Movement ${index}: You ${
//     movement > 0 ? 'deposited' : 'withdrew'
//   } ${Math.abs(movement)}`;
// });

// console.log(movementsDescriptions);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// const withdrawals = movements.filter(mov => mov < 0);

// console.log(withdrawals);

// const balance = movements.reduce(function (acc, cur, i, arr) {
//   return acc + cur;
// }, 0);

// console.log(balance);

// const maxVal = movements.reduce(
//   (acc, cur) => (acc < cur ? cur : acc),
//   movements[0]
// );

// console.log(maxVal);

// const eurToUSD = 1.1;
// const totalDeposits = movements
//   .filter(mov => mov > 0)
//   // .map(mov => mov * eurToUSD)
//   .map((mov, i, arr) => {
//     return mov * eurToUSD;
//   })
//   .reduce((acc, curr) => acc + curr, 0);

// console.log(totalDeposits);

// Challenge 1
// const checkDogs = function (dogsJulia, dogsKate) {
//   const shallowJulia = dogsJulia.slice(1, -2);

//   const mergedDogs = shallowJulia.concat(dogsKate);

//   mergedDogs.forEach(function (dogAge, index) {
//     if (dogAge >= 3) {
//       console.log(
//         `Dog number ${index + 1} is an adult, and is ${dogAge} years old`
//       );
//     } else {
//       console.log(`Dog number ${index + 1} is still a puppy`);
//     }
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// Challenge 2
// const calcAverageHumanAge = function (dogAges) {
//   const newAges = dogAges.map(age => (age <= 2 ? 2 * age : 16 + age * 4));

//   console.log(newAges);

//   const filteredAges = newAges.filter(age => age >= 18);

//   console.log(filteredAges);

//   const calculateAges = filteredAges.reduce(
//     (acc, curr, i, arr) => acc + curr / arr.length,
//     0
//   );

//   console.log(calculateAges);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// Challenge 3
// const calcAverageHumanAge = dogAges => {
//   const newAges = dogAges
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

//   console.log(newAges);
// };

// calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// const firstWithdrawal = movements.find(mov => mov < 0);

// console.log(firstWithdrawal);
// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// console.log(movements);
// console.log(movements.includes(-130));

// // some
// const anyDeposits = movements.some(mov => mov > 5000);
// console.log(anyDeposits);

// // every
// console.log(account4.movements.every(mov => mov > 0));

// // separate
// const deposit = mov => mov > 0;

// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];

// console.log(arrDeep.flat(2));

// const accountMovement = accounts.map(acc => acc.movements);

// console.log(accountMovement);

// const allMovements = accountMovement.flat();

// console.log(allMovements);

// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance);

// const accountMovement = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(accountMovement);

// const accountMovement2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(accountMovement2);

// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// console.log(movements);

// // movements.sort((a, b) => {
// //   if (a > b) return 1;

// //   if (b > a) return -1;
// // });

// movements.sort((a, b) => a - b);

// console.log(movements);

// const arr = [1, 2, 3, 4, 5, 6];
// const x = new Array(7);
// console.log(x);
// x.fill(1, 3);
// console.log(x);

// arr.fill(23, 4, 6);
// console.log(arr);

// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const dice = Array.from(
//   { length: 7 },
//   () => Math.trunc(Math.random() * 10) + 1
// );
// console.log(dice);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => el.textContent.replace('€', '')
//   );

//   console.log(movementsUI);

//   const movementsUI2 = [...document.querySelectorAll('.movements__value')];
// });

// const bankDepositSum = accounts
//   .flatMap(account => account.movements)
//   .filter(mov => mov > 0)
//   .reduce((acc, curr) => acc + curr, 0);

// console.log(bankDepositSum);

// const numDeposits1000 = accounts
//   .flatMap(account => account.movements)
//   .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);

// console.log(numDeposits1000);

// let a = 10;

// console.log(++a);
// console.log(a);

// const { deposits, withdrawals } = accounts
//   .flatMap(account => account.movements)
//   .reduce(
//     (sums, curr) => {
//       // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
//       sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// const convertTitleCase = function (title) {
//   const capitalize = value => value[0].toUpperCase() + value.slice(1);

//   const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'and', 'with'];
//   const newTitle = title
//     .toLowerCase()
//     .split(' ')
//     .map(value => (exceptions.includes(value) ? value : capitalize(value)))
//     .join(' ');
//   console.log(capitalize(newTitle));
// };

// convertTitleCase('this is a nice title');
// convertTitleCase('and this is a LONG title');

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

console.log(dogs);

// 1
dogs.forEach(dogs => (dogs.recommendedFood = dogs.weight ** 0.75 * 28));

console.log(dogs);

// 2
const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
  }`
);

// 3
const { ownersEatTooMuch, ownersEatTooLittle } = dogs.reduce(
  (acc, curr) => {
    curr.curFood > curr.recommendedFood
      ? acc.ownersEatTooMuch.push(curr.owners)
      : acc.ownersEatTooLittle.push(curr.owners);
    return acc;
  },
  {
    ownersEatTooMuch: [],
    ownersEatTooLittle: [],
  }
);

console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

// 4
// const loggg = function (dogOwner) {
//   const newStr = dogOwner.flat().join(' And ');
//   console.log(newStr);
// };

console.log(`${ownersEatTooMuch.flat().join(' And ')} dogs eat too much!`);
console.log(`${ownersEatTooLittle.flat().join(' And ')} dogs eat too little!`);

// 5
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

//6
const funcOkay = dog => {
  return (
    dog.curFood > dog.recommendedFood * 0.9 &&
    dog.curFood < dog.recommendedFood * 1.1
  );
};

console.log(dogs.some(dog => funcOkay(dog)));

// 7
const { dogOkay } = dogs.reduce(
  (acc, dog) => {
    if (funcOkay(dog)) acc.dogOkay.push(dog.owners);
    return acc;
  },
  { dogOkay: [] }
);

console.log(dogOkay);

// 8
const shallowDogs = dogs.slice().sort((a, b) => a.curFood - b.curFood);
console.log(shallowDogs);
