# Setting Up Vitest for Unit Testing in SvelteKit

## 1. Install Vitest
To get started with Vitest for unit testing, install it as a development dependency:

```bash
npm install -D vitest
```

## 2. Configure `vite.config.js`

Update your `vite.config.js` file to support Vitest's requirements. If you don't have this file, create one in the root of your project.

### Example `vite.config.js`:

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
    // Other configurations go here...

    // Tell Vitest to use the `browser` entry points in `package.json` files,
    // even though it's running in Node.js
    resolve: process.env.VITEST
        ? {
                conditions: ['browser']
            }
        : undefined
});
```

## 3. Write a Simple Testable Module

Create a module to test. For example, a utility function to double numbers could look like this:

### File: `multiplier.js`

```javascript
import { writable } from 'svelte/store';

export function multiplier(initial, factor) {
  const value = writable(initial);

  const set = (newValue) => {
    value.set(newValue * factor);
  };

  return {
    subscribe: value.subscribe,
    set,
    value: initial * factor
  };
}
```

## 4. Write a Unit Test

Create a test file with the `.test.js` extension (e.g., `multiplier.svelte.test.js`), and use Vitest to test the module:

### File: `multiplier.svelte.test.js`

```javascript
import { expect, test } from 'vitest';
import { multiplier } from './multiplier.js';

test('Multiplier works as expected', () => {
  const double = multiplier(0, 2);

  // Initial value should be 0
  expect(double.value).toEqual(0);

  // Update value
  double.set(5);

  // Value should be doubled
  expect(double.value).toEqual(10);
});
```

## 5. Run Your Tests

Run the following command to execute your tests:

```bash
npx vitest
```

Alternatively, add a test script to your package.json:

```json
"scripts": {
  "test": "vitest"
}
```

Now, run tests using:

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