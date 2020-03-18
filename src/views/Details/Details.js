import AccountCard from '../../components/AccountCard';
import Balance from '../../components/Balance';
import PaymentItem from '../../components/PaymentItem';
import PaymentDialog from '../../components/PaymentDialog';
import LockedItem from '../../components/LockedItem';
import store from '../../store';
import router from '../../router';
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import InfiniteLoading from 'vue-infinite-loading';
import { fetchPayments } from '../../services/PaymentService';

export default {
  name: 'Details',
  components: { AccountCard, Balance, PaymentItem, PaymentDialog, LockedItem, InfiniteLoading },
  props: [],
  data() {
    return {
      selectedPayment: null,
      name: null,
      tab: 0,
    };
  },
  beforeMount() {
    const account = store.getters.accounts.find(
      x => x.name === this.$route.params.account,
    );
    if (!account) {
      router.push({ name: 'home' });
      return;
    }
    this.id = account.id;
  },
  methods: {
    ...mapActions(['fetchPayments', 'changeWalletName', 'deleteAccount']),
    ...mapMutations(['addPayments']),
    openPayment(payment) {
      this.selectedPayment = payment;
    },
    showDate(payment, i) {
      const previousPayment = this.accountPayments[i - 1];
      if (!previousPayment) {
        return true;
      }
      const time = moment(String(payment.created_at));

      return !time.isSame(String(previousPayment.created_at), 'day');

    },
    change() {
      this.changeWalletName({ account: this.account, name: this.name });
      router.push({ name: 'home' });
    },
    copyAddress() {
      this.$root.$emit('copy', {
        title: 'Copy address to clipboard',
        toCopy: this.account.id,
        callback: () => {
          this.$flashMessage.info(
            `Address has been copied to clipboard (${this.account.id.substring(
              0,
              8,
            )}...).`,
          );
        },
      });
    },
    copySeed() {
      this.$root.$emit('copy', {
        title: 'Copy seed to clipboard',
        toCopy: this.seed,
        callback: () => {
          this.$flashMessage.info(
            `Address has been copied to clipboard (${this.account.id.substring(
              0,
              8,
            )}...).`,
          );
        },
      });
    },
    async deleteWallet() {
      await this.deleteAccount(this.account);
      router.push({ name: 'home' });
    },
    async infiniteHandler($state) {
      const lastPayment = this.accountPayments[this.accountPayments.length - 1]
      const payments = await fetchPayments(this.id, lastPayment.id);
      this.addPayments({payments, id:this.id});
      $state.loaded();
    },
  },
  computed: {
    ...mapGetters(['threeBotName', 'payments', 'accounts', 'isPaymentLoading']),
    account() {
      return this.accounts.find(a => a.id === this.id);
    },
    accountPayments() {
      return this.payments(this.id);
    },
    getHumanWalletAddress() {
      return `${this.account.name.replace(/\s/g, '')}@${this.threeBotName}`;
    },
  },
  mounted() {
    // this.fetchPayments(this.account.id);
    this.name = this.account.name;
  },
};
