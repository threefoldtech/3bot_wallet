import { mapGetters } from 'vuex';
import { fetchAccount } from '../../services/AccountService';

export default {
  state: {
    accounts: [],
    accountThombstones: [],
  },
  computed: {
    ...mapGetters(['appSeedPhrase']),
  },
  actions: {
    generateAppAccount: async (context, walletName) => {
      context.commit('addAccountThombstone', walletName);
      const nextAppAcountIndex = context.getters.nextAppAcountIndex;
      const seedPhrase = context.getters.appSeedPhrase;
      const position = context.state.accounts.length;
      const account = await fetchAccount({
        index: nextAppAcountIndex,
        name: walletName,
        tags: ['app'],
        seedPhrase,
        position: position,
      });
      context.dispatch('fetchPayments', account.id);
      context.commit('removeAccountThombstone', walletName);
      context.commit('addAccount', account);
    },
    generateImportedAccount: async (context, { seedPhrase, walletName }) => {
      const position = context.state.accounts.length;
      const account = await fetchAccount({
        index: 0,
        name: walletName,
        tags: ['imported'],
        seedPhrase,
        position: position,
      });
      context.dispatch('fetchPayments', account.id);
      context.commit('addAccount', account);
    },
    syncAccounts: async ({ commit, getters, dispatch }) => {
      commit('startAppLoading');
      const op1 = await dispatch(
        'initializePkidAppAccounts',
        getters.appSeedPhrase
      );
      console.log({ op1 });

      const op2 = await dispatch('initializeImportedPkidAccounts');
      await Promise.all([...op1, ...op2]);
      await dispatch('saveToPkid');
      console.log('aftersave');
      commit('stopAppLoading');
    },
    changeWalletName: async ({ commit, dispatch }, { account, name }) => {
      commit('startAppLoading');
      account.name = name;
      commit('addAccount', account);
      await dispatch('saveToPkid');
      commit('stopAppLoading');
    },
  },
  mutations: {
    addAccount: (state, account) => {
      const index = state.accounts.findIndex(a => a.id === account.id);

      if (index === -1) {
        state.accounts.push(account);
        return;
      }
      state.accounts[index] = account;
    },
    removeAccount: (state, account) => {
      state.accounts = state.accounts.filter(item => item !== account);
    },
    removeAppAccount: state => {
      state.accounts = state.accounts.filter(
        account => !account.tags.includes('app')
      );
    },
    addAccountThombstone: (state, name) => {
      state.accountThombstones.push(name);
    },
    removeAccountThombstone: (state, name) => {
      state.accountThombstones = state.accountThombstones.filter(
        item => item !== name
      );
    },
    setAccounts: (state, accounts) => {
      state.accounts = accounts;
    },
  },
  getters: {
    accounts: state => state.accounts,
    nextAppAcountIndex: state => {
      // @Reminder if deleted accounts are not in the account array,
      // this will not be correct
      const amount = state.accounts.filter(account =>
        account.tags.includes('app')
      ).length;
      const index = amount;
      console.log(index);
      return index;
    },
    accountThombstones: state => state.accountThombstones,
  },
};