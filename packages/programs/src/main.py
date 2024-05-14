from nada_dsl import *


"""
Output will be a full board of numbers(576) with each tile having values.

-1/1           |  Game Over
-1            |  Untouched Tile
1 - 8         |  No of Adjacent Mines
10             |  Mine
11            |  Flag



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


BOARD_SIZE = 16


def is_valid(row: int, col: int) -> bool:
    if row >= 0 and row < BOARD_SIZE and col >= 0 and col < BOARD_SIZE:
        return True
    return False


def is_mine(board: list[list[SecretInteger]], row: int, col: int) -> bool:
    ele: SecretInteger = board[row][col]
    if ele == SecretInteger(10):
        return True
    return False


def count_adjacent_mines(board: list[list[SecretInteger]], row: int, col: int):
    count = 0
    dx = [-1, -1, -1, 0, 0, 1, 1, 1]
    dy = [-1, 0, 1, -1, 1, -1, 0, 1]
    for i in range(8):
        newRow = row + dx[i]
        newCol = col + dy[i]
        if (is_valid(newRow, newCol)):
            if (is_mine(board, newRow, newCol)):
                count += 1
    return count + 1


def is_game_over(board: list[list[SecretInteger]]) -> bool:
    # game over if there is not tile with -1
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if board[i][j] == SecretInteger(-1):
                return 0
    return 1


def make_move(board: list[list[SecretInteger]], row: int, col: int):
    # Base Recursive Case
    if (not board[row][col] == SecretInteger(-1)):
        return board

    # Calculate the number of adjacent mines and put it on the board
    mine_count = count_adjacent_mines(board, row, col)
    board[row][col] = SecretInteger(mine_count)

    # Recursive Case
    if (mine_count == 1):
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


def nada_main():
   # Party 1 places Mines
    party1 = Party(name="Party1")
    # Party 2 Minesweepes the board.
    party2 = Party(name="Party2")

    board: list[list[SecretInteger]] = []
    mine_locations: list[list[SecretInteger]] = []
    mine_locations_int: list[list[int]] = []
    location: list[SecretInteger] = []

    # Take 24 Mine Locations by Party 1
    for i in range(BOARD_SIZE):
        mine_locations.append([])
        mine_locations_int.append([-1, -1])
        mine_locations[i].append(SecretInteger(
            Input(name="mine-x-" + str(i), party=party1)))
        mine_locations[i].append(SecretInteger(
            Input(name="mine-y-" + str(i), party=party1)))

    for i in range(BOARD_SIZE):
        x, y = -1, -1
        if (mine_locations[i][0] == SecretInteger(i + 1)):
            x = i
        if (mine_locations[i][1] == SecretInteger(i + 1)):
            y = i
        mine_locations_int.append([x, y])

    # Take Board from Party 2
    for i in range(BOARD_SIZE):
        board.append([])
        for j in range(BOARD_SIZE):
            board[i].append(SecretInteger(
                Input(name="board-" + str(i) + "-" + str(j), party=party1)))

    # Add Mines Location to Board
    for i in range(BOARD_SIZE):
        [mine_x, mine_y] = mine_locations_int[i]
        board[mine_x][mine_y] = SecretInteger(10)

    # Take Input Location from Party 2
    for i in range(2):
        location.append(SecretInteger(
            Input(name=f"location-{i}", party=party2)))

    x, y = -1, -1
    for i in range(BOARD_SIZE):
        if (location[0] == SecretInteger(i + 1)):
            x = i
        if (location[1] == SecretInteger(i + 1)):
            y = i

    updated_board = make_move(board, x, y)
    game_over = is_game_over(updated_board)
    outputs: list[Output] = [
        Output(Integer(game_over), "game_over", party1)
    ]

    for i in range(BOARD_SIZE - 1):
        for j in range(BOARD_SIZE):
            outputs.append(
                Output(updated_board[i][j], "out-board-" + str(i) + "-" + str(j), party1))

    return outputs
