const test = {
  program: 'minesweeper',
  inputs: {
    secrets: {},
  },
  expected_outputs: {},
};

for (let i = 0; i < 24; i++) {
  test.inputs.secrets[`mineX-${i}`] = {
    SecretInteger: String(i),
  };
  test.inputs.secrets[`mineY-${i}`] = {
    SecretInteger: String(i),
  };
  for (let j = 0; j < 24; j++) {
    test.inputs.secrets[`board-${i}-${j}`] = {
      SecretInteger: `-1`,
    };
    test.expected_outputs[`board-${i}-${j}`] = {
      SecretInteger: `-1`,
    };
  }
}

test.expected_outputs[`board-1-0`] = {
  SecretInteger: `2`,
};
test.expected_outputs['game_over'] = {
  SecretInteger: `0`,
};

console.log(JSON.stringify(test, null, 2));
