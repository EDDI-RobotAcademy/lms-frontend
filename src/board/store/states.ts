export interface BoardState {
    boards: Board[]
}

export interface Board {
    boardId: number
    title: string
    writer: string
    content: string
    regDate: string
    updDate: string
}

const state: BoardState = {
    boards: [],
}

export default state