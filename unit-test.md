# Setting Up Jest for Unit Testing in SvelteKit

## 1. Install Jest
To get started with Jest for unit testing, install it as a development dependency:

```bash
npm install --save-dev jest
```

## 2. Add test folder and add files:

Create the `sum.js` and `sum.test.js` files.

### Example `sum.js`:

```javascript
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

### Example `sum.test.js`:

```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

## 5. Run Your Tests

Run the following command to execute your tests:

```bash
npm run test
```

## 6. Example Output

```
 ✓ Multiplier works as expected

Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  16:21:10
   Duration  500ms
```