function isPalindrome(word) {
  if (typeof word !== 'string') return false; 
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}

// Mock usage
const testWords = [
  'Racecar',
  'hello',
  'A man, a plan, a canal, Panama',
  '12321',
  'Not a palindrome',
];
testWords.forEach((word) => {
  console.log(`"${word}" is ${isPalindrome(word) ? '' : 'not '}a palindrome.`);
});

module.exports = isPalindrome;
