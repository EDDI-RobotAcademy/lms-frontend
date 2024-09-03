import { MutationTree } from "vuex";
import { AccountState} from "./states";
import { REQUEST_IS_LOGIN_TO_DJANGO } from "./mutation-types";

export interface AccountMutations extends MutationTree<AccountState> {
    [REQUEST_IS_LOGIN_TO_DJANGO](state: AccountState, settingValue: boolean): void
}

const mutations: MutationTree<AccountState> = {
    [REQUEST_IS_LOGIN_TO_DJANGO](state: AccountState,  settingValue: boolean): void {
        state.isLoggedIn = settingValue
    }
}

export default mutations as AccountMutations