export function generateString(length: number) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

export function generateNumber(length:number){
  const numbers = [0,1,2,3,4,5,6,7,8,9];
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result += numbers[randomIndex];
  }
  return result;
}

export function randomEmailGenerator() {
  const email =
    generateString(10) + generateNumber(5) + '@' + generateString(5) + '.com';
  return email;
}
