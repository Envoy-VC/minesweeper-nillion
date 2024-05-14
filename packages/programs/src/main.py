from nada_dsl import *

BOARD_SIZE = 24

valid = Integer(1)
invalid = Integer(0)

dx = [Integer(-1), Integer(-1), Integer(-1), Integer(0),
      Integer(0), Integer(1), Integer(1), Integer(1)]
dy = [Integer(-1), Integer(0), Integer(1), Integer(-1),
      Integer(1), Integer(-1), Integer(0), Integer(1)]


def is_mine(
    mine_locations: list[list[SecretInteger]],
    row: SecretInteger, col: SecretInteger
) -> SecretInteger:
    result = Integer(-1)
    for mine in mine_locations:
        result = result * ((row * Integer(100) + col) -
                           (mine[0] * Integer(100) + mine[1]))

    res = (result > Integer(0)).if_else(
        invalid, (result < Integer(0)).if_else(invalid, valid))
    return res


def is_valid(row: SecretInteger, col: SecretInteger) -> SecretInteger:
    valid_row_max = row < Integer(BOARD_SIZE)
    valid_row_min = row > Integer(0)
    valid_col_max = col < Integer(BOARD_SIZE)
    valid_col_min = col > Integer(0)

    cmp_row_max = valid_row_max.if_else(valid, invalid)
    cmp_row_min = valid_row_min.if_else(valid, invalid)
    cmp_col_max = valid_col_max.if_else(valid, invalid)
    cmp_col_min = valid_col_min.if_else(valid, invalid)

    res = cmp_row_max * cmp_row_min * cmp_col_max * cmp_col_min
    return res


def count_adjacent_mines(
    mine_locations: list[list[SecretInteger]],
    row: SecretInteger,
    col: SecretInteger
) -> SecretInteger:
    count = Integer(1)
    for i in range(8):
        newRow = row + dx[i]
        newCol = col + dy[i]
        valid = is_valid(newRow, newCol)
        mine = is_mine(mine_locations, newRow, newCol)
        count = count + (Integer(1) * valid * mine)

    return count


def make_move(
    mine_locations: list[list[SecretInteger]],
    row: SecretInteger,
    col: SecretInteger
) -> list[Output]:
    outputs: list[Output] = []
    count = count_adjacent_mines(mine_locations, row, col)
    game_over = is_mine(mine_locations, row, col)

    outputs.append(Output(count, "adjacent_mines", Party("Party1")))
    outputs.append(Output(game_over, "game_over", Party("Party1")))

    return outputs


def nada_main():
    party1 = Party(name="Party1")
    party2 = Party(name="Party2")

    mine_locations: list[list[SecretInteger]] = []
    location: list[SecretInteger] = []

    # Take Mine Locations from Party 1
    for i in range(BOARD_SIZE):
        mine_locations.append([])
        mine_locations[i].append(SecretInteger(
            Input(name="mine-x-" + str(i), party=party1)))
        mine_locations[i].append(SecretInteger(
            Input(name="mine-y-" + str(i), party=party1)))

    # Take Input Location from Party 2
    for i in range(2):
        location.append(SecretInteger(
            Input(name=f"location-{i}", party=party2)))

    outputs: list[Output] = make_move(
        mine_locations, row=location[0], col=location[1])

    return outputs
