function isPalindrome(word) {
  if (typeof word !== 'string') return false; 
  const clean = word.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}
module.exports = isPalindrome;