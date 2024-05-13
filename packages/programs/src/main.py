from nada_dsl import *


"""
Output will be a full board of numbers(576) with each tile having values.

0/1           |  Game Over
-1            |  Untouched Tile
0 - 8         |  No of Adjacent Mines.
9             |  Mine
10            |  Flag



dx = [-1, -1, -1, 0, 0, 1, 1, 1]
dy = [-1, 0, 1, -1, 1, -1, 0, 1]


N -->  North        (row-1, col)
S -->  South        (row+1, col)
E -->  East         (row, col+1)
W -->  West            (row, col-1)
N.E--> North-East   (row-1, col+1)
N.W--> North-West   (row-1, col-1)
S.E--> South-East   (row+1, col+1)
S.W--> South-West   (row+1, col-1)

"""


def is_valid(row: int, col: int) -> bool:
    if row >= 0 and row < 24 and col >= 0 and col < 24:
        return True
    return False


def is_mine(board: list[list[SecretInteger]], row: int, col: int) -> bool:
    ele: SecretInteger = board[row][col]
    if ele.public_equals(SecretInteger(9)):
        return True
    return False


def count_adjacent_mines(board: list[list[SecretInteger]], row: int, col: int):
    count = 0
    dx = [-1, -1, -1, 0, 0, 1, 1, 1]
    dy = [-1, 0, 1, -1, 1, -1, 0, 1]
    for i in range(8):
        newRow = row + dx[i]
        newCol = col + dy[i]
        if (is_mine(board, newRow, newCol)):
            count += 1
    return count


def is_game_over(board: list[list[SecretInteger]]) -> bool:
    # game over if there is not tile with -1
    for i in range(24):
        for j in range(24):
            if board[i][j].public_equals(SecretInteger(-1)):
                return 0
    return 1


def make_move(board: list[list[SecretInteger]], row: int, col: int):
    # Base Recursive Case
    if (board[row][col].public_equals(SecretInteger(-1)).__eq__(PublicBoolean(False))):
        return board

    # Calculate the number of adjacent mines and put it on the board
    mine_count = count_adjacent_mines(board, row, col)
    board[row][col] = SecretInteger(mine_count)

    # Recursive Case
    if (mine_count == 0):
        # Recursive call for all adjacent
        dx = [-1, -1, -1, 0, 0, 1, 1, 1]
        dy = [-1, 0, 1, -1, 1, -1, 0, 1]
        for i in range(8):
            newRow = row + dx[i]
            newCol = col + dy[i]
            if (is_valid(newRow, newCol)):
                if (not is_mine(board, newRow, newCol)):
                    make_move(board, newRow, newCol)

    return board


def get_output_board(board: list[list[SecretInteger]], party: Party) -> list[Output]:
    outputs: list[Output] = []
    for i in range(23):
        for j in range(23):
            outputs.append(
                Output(board[i][j], "board-" + str(i) + "-" + str(j), party))
    return outputs


def nada_main():
   # Party 1 places Mines
    party1 = Party(name="Party1")
    # Party 2 Minesweepes the board.
    party2 = Party(name="Party2")

    board: list[list[SecretInteger]] = []
    mine_locations: list[list[SecretInteger]] = []
    mine_locations_int: list[list[int]] = []
    location: list[SecretInteger] = []

    for i in range(24):
        mine_locations.append([SecretInteger(-1), SecretInteger(-1)])
        mine_locations_int.append([-1, -1])
        board.append([SecretInteger(-1) for _ in range(24)])
    for i in range(2):
        location.append(SecretInteger(-1))

    # Take 24 Mine Locations by Party 1
    for i in range(24):
        mine_locations[i] = [
            SecretInteger(Input(name="mine-x-" + str(i), party=party1)),
            SecretInteger(Input(name="mine-x-" + str(i), party=party1))
        ]
        x, y = -1, -1
        for i in range(24):
            if (mine_locations[i][0].public_equals(SecretInteger(i))):
                x = i
            if (mine_locations[i][1].public_equals(SecretInteger(i))):
                y = i

        mine_locations_int.append([x, y])

    # Take Board from Party 2
    for i in range(24):
        for j in range(24):
            # 2d array
            board[i][j] = SecretInteger(
                Input(name=f"board-{i}-{j}", party=party2))

    # Add Mines Location to Board
    for i in range(24):
        [mine_x, mine_y] = mine_locations_int[i]
        board[mine_x][mine_y] = SecretInteger(9)

    # Take Input Location from Party 2
    for i in range(2):
        location[i] = SecretInteger(
            Input(name=f"location-{i}", party=party2))

    x, y = -1, -1
    for i in range(24):
        if (location[0].public_equals(SecretInteger(i))):
            x = i
        if (location[1].public_equals(SecretInteger(i))):
            y = i

    did_hit_mine = is_mine(board, x, y)

    if (did_hit_mine):
        outputs: list[Output] = get_output_board(board, party2)
        outputs.append(Output(Integer(1), "game_over", party1))
        return outputs
    else:
        updated_board = make_move(board, x, y)
        game_over = is_game_over(updated_board)
        outputs: list[Output] = get_output_board(updated_board, party2)
        outputs.append(Output(Integer(game_over), "game_over", party1))
        return outputs
