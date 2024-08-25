import { MutationTree } from "vuex";
import { AccountState } from "./states";
import {
    REQUEST_IS_PROFILEIMG_TO_DJANGO,
} from "./mutation-types";

export interface AccountMutations extends MutationTree<AccountState> {
    [REQUEST_IS_PROFILEIMG_TO_DJANGO](state: AccountState, settingValue: number): void
}

const mutations: MutationTree<AccountState> = {
    [REQUEST_IS_PROFILEIMG_TO_DJANGO](state: AccountState, settingValue: number): void {
        state.isProfileImg = settingValue
    }
}

export default mutations as AccountMutations