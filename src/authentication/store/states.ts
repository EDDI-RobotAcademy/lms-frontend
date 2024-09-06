export interface AuthenticationState {
    isAuthenticated: boolean
    ticket: number;
}

const state: AuthenticationState = {
    isAuthenticated: false,
    ticket: 0,
}

export default state