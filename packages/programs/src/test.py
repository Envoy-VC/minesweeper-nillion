def is_valid(row: int, col: int) -> bool:
    if row >= 0 and row < 24 and col >= 0 and col < 24:
        return True
    return False


def is_mine(board: list[list[int]], row: int, col: int) -> bool:
    ele = board[row][col]
    if ele == (9):
        return True
    return False


def count_adjacent_mines(board: list[list[int]], row: int, col: int):
    count = 0
    dx = [-1, -1, -1, 0, 0, 1, 1, 1]
    dy = [-1, 0, 1, -1, 1, -1, 0, 1]
    for i in range(8):
        newRow = row + dx[i]
        newCol = col + dy[i]
        if (is_valid(newRow, newCol)):
            if (is_mine(board, newRow, newCol)):
                count += 1
    return count


def is_game_over(board: list[list[int]]) -> bool:
    # game over if there is not tile with -1
    for i in range(24):
        for j in range(24):
            if board[i][j] == (-1):
                return 0
    return 1


def make_move(board: list[list[int]], row: int, col: int):
    # Base Recursive Case
    if (board[row][col] != -1):
        return board

    # Calculate the number of adjacent mines and put it on the board
    mine_count = count_adjacent_mines(board, row, col)
    board[row][col] = (mine_count)

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


def print_board(board: list[list[int]]):
    for i in range(24):
        for j in range(24):
            print(board[i][j], end=" ")
        print()


if __name__ == "__main__":
    board: list[list[int]] = []
    mine_locations: list[list[int]] = []
    mine_locations_int: list[list[int]] = []
    location: list[int] = []

    for i in range(24):
        mine_locations.append([-1, -1])
        mine_locations_int.append([-1, -1])
        board.append([(-1) for _ in range(24)])
    for i in range(2):
        location.append((-1))

    # Take 24 Mine Locations by Party 1
    for i in range(24):
        mine_locations[i] = [i, i]
        x = i
        y = i

        mine_locations_int[i] = ([x, y])

    # Take Board from Party 2
    for i in range(24):
        for j in range(24):
            # 2d array
            board[i][j] = -1

    # Add Mines Location to Board
    for i in range(24):
        [mine_x, mine_y] = mine_locations_int[i]
        print(f"Adding Mine at {mine_x}, {mine_y}")
        board[mine_x][mine_y] = (9)

    # Take Input Location from Party 2
    location[0] = 1
    location[1] = 4

    x, y = -1, -1
    for i in range(24):
        if (location[0] == i):
            x = i
        if (location[1] == i):
            y = i

    did_hit_mine = is_mine(board, x, y)
    print("Initial Board\n\n")
    print_board(board)
    print(f"Playing Move: {location[0]} {location[1]}\n\n")

    if (did_hit_mine):
        print("Game Over")
    else:
        updated_board = make_move(board, x, y)
        game_over = is_game_over(updated_board)
        print("Next Board\n\n")
        print_board(updated_board)
