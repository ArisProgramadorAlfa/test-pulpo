const countryCode = process.argv[2];
const year = process.argv[3];

console.log('Hello world!!!');
console.log(JSON.stringify({
  countryCode,
  year
}, null, 4));