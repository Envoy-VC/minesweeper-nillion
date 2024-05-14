const test = {
  program: 'minesweeper',
  inputs: {
    secrets: {},
  },
  expected_outputs: {},
};

const BOARD_SIZE = 3;

for (let i = 0; i < BOARD_SIZE; i++) {
  test.inputs.secrets[`mine-x-${i}`] = {
    SecretInteger: String(i),
  };
  test.inputs.secrets[`mine-y-${i}`] = {
    SecretInteger: String(i),
  };
  for (let j = 0; j < BOARD_SIZE; j++) {
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

test.inputs.secrets['location-0'] = {
  SecretInteger: String(1),
};

test.inputs.secrets['location-1'] = {
  SecretInteger: String(0),
};

console.log(JSON.stringify(test, null, 2));
