const o = {};

Object.defineProperty(o, "a", {
    value: 1,
    enumerable: true,
});

Object.defineProperty(o, "b", {
    value: 2,
    enumerable: false,
});

Object.defineProperty(o, "c", {
    value: 3,
}); // enumerable defaults to false

o.d = 4; // enumerable defaults to true when creating a property by setting it

Object.defineProperty(o, Symbol.for("e"), {
    value: 5,
    enumerable: true,
});

Object.defineProperty(o, Symbol.for("f"), {
    value: 6,
    enumerable: false,
    /* For non-Symbol properties, it also defines whether it shows up in a for...in loop and Object.keys() or not. */
        // El default es false pero no veo como hacer algo distinto en las Symbol Props
});

for (const prop in o) {
    console.log('for...in ', prop);
}
// Logs 'a' and 'd' (always in that order)

Object.keys(o); // ['a', 'd']

console.log( 'o.propertyIsEnumerable("a"); // true', o.propertyIsEnumerable("a") );
console.log( 'o.propertyIsEnumerable("b"); // false', o.propertyIsEnumerable("b") );
console.log( 'o.propertyIsEnumerable("c"); // false', o.propertyIsEnumerable("c") );
console.log( 'o.propertyIsEnumerable("d"); // true', o.propertyIsEnumerable("d") );
console.log( 'o.propertyIsEnumerable(Symbol.for("e")); // true', o.propertyIsEnumerable(Symbol.for("e")) );
console.log( 'o.propertyIsEnumerable(Symbol.for("f")); // false', o.propertyIsEnumerable(Symbol.for("f")) );

const p = { ...o };
p.a; // 1
p.b; // undefined
p.c; // undefined
p.d; // 4
p[Symbol.for("e")]; // 5
p[Symbol.for("f")]; // undefined

console.info( 'p', p );
