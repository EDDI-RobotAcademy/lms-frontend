import { MutationTree } from "vuex";
import { AuthenticationState } from "./states";
import {
    REQUEST_IS_AUTHENTICATED_TO_DJANGO,
} from "./mutation-types";

export interface AuthenticationMutations extends MutationTree<AuthenticationState> {
    [REQUEST_IS_AUTHENTICATED_TO_DJANGO](state: AuthenticationState, settingValue: boolean): void
    SET_TICKET(state: AuthenticationState, ticket: number): void;
}

const mutations: MutationTree<AuthenticationState> = {
    [REQUEST_IS_AUTHENTICATED_TO_DJANGO](state: AuthenticationState, settingValue: boolean): void {
        state.isAuthenticated = settingValue
    },
    SET_TICKET(state: AuthenticationState, ticket: number) {
        state.ticket = ticket;
      },
}

export default mutations as AuthenticationMutations