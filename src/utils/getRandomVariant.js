export function getRandomVariant(input) {
  if (Array.isArray(input)) {
    return input[Math.floor(Math.random() * input.length)];
  } else if (typeof input === "object" && input !== null) {
    const values = Object.values(input);
    return values[Math.floor(Math.random() * values.length)];
  }
  return input;
}

export default getRandomVariant;
