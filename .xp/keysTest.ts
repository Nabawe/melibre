// Performance comparison of number vs string keys in Map
const NUMBER_OF_ITEMS = 16_777_210;

// Approach 1: Using numbers as keys
function testNumberKeys() {
    const map = new Map();
    console.time('number-keys');

    for (let i = 0; i < NUMBER_OF_ITEMS; i++) {
        // try {
            map.set(i, `value-${i}`);
        // } catch( err ) {
            // return console.error( new Error( `WITNESS = ${i}:\n ${( err as Error ).message}` ) );
        // };
    }

    // Test lookup
    const randomKey = Math.floor(Math.random() * NUMBER_OF_ITEMS);
    map.get(randomKey);

    console.timeEnd('number-keys');
    return map;
}

// Approach 2: Using string-based keys (base-36)
function testStringKeys() {
    const map = new Map();
    console.time('string-keys');

    for (let i = 0; i < NUMBER_OF_ITEMS; i++) {
        const key = i.toString(36); // Built-in base-36 conversion (0-9, a-z)
        map.set(key, `value-${i}`);
    }

    // Test lookup
    const randomKey = Math.floor(Math.random() * NUMBER_OF_ITEMS).toString(36);
    map.get(randomKey);

    console.timeEnd('string-keys');
    return map;
}

// Approach 3: Custom alphanumeric key generation
function generateCustomKey(num) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let key = '';

    while (num > 0) {
        key = chars[num % chars.length] + key;
        num = Math.floor(num / chars.length);
    }

    return key || '0';
}

function testCustomKeys() {
    const map = new Map();
    console.time('custom-keys');

    for (let i = 0; i < NUMBER_OF_ITEMS; i++) {
        const key = generateCustomKey(i);
        map.set(key, `value-${i}`);
    }

    // Test lookup
    const randomKey = generateCustomKey(Math.floor(Math.random() * NUMBER_OF_ITEMS));
    map.get(randomKey);

    console.timeEnd('custom-keys');
    return map;
}

// Memory usage helper
function getMemoryUsage(map) {
    const entries = Array.from(map.entries());
    const size = new Blob([JSON.stringify(entries)]).size;
    return `Approximate memory usage: ${(size / 1024 / 1024).toFixed(2)} MB`;
}

// Test all approaches
const numberMap = testNumberKeys();
const stringMap = testStringKeys();
const customMap = testCustomKeys();

console.log('Number keys:', getMemoryUsage(numberMap));
console.log('String keys:', getMemoryUsage(stringMap));
console.log('Custom keys:', getMemoryUsage(customMap));

console.log( 'Number.MAX_SAFE_INTEGER = ', Number.MAX_SAFE_INTEGER );
console.log( { NUMBER_OF_ITEMS } );

