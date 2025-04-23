const isPalindrome = require('./isPalindrome');

test('Palindrome simple', () => {
  expect(isPalindrome('radar')).toBe(true);
});

test('Mot normal', () => {
  expect(isPalindrome('bonjour')).toBe(false);
});

test('Mot vide', () => {
  expect(isPalindrome('')).toBe(true);
});

test('Non-string', () => {
  expect(isPalindrome(12321)).toBe(false);
});