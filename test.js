const arr = [[3], [4], [5], [1, 11], [1, 11]];

const calcAce = function (num) {
  const output = [];
  for (let i = 0; i <= num; i++) {
    output.push(i * 10 + num);
  }
  return output;
};

console.log(ace(3));
