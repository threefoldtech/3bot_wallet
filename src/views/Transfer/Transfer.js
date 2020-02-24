import FormComponent from './components/formComponent';
import QrDialog from './components/qrDialog';
import TransactionInfoDialog from './components/transactionInfoDialog';
import { mapGetters, mapActions } from 'vuex';
import { doPayment } from '../../services/PaymentService';

export default {
  name: 'transfer',
  components: {
    FormComponent,
    TransactionInfoDialog,
    // QrScannerDialog,
    QrDialog,
  },
  data () {
    return {
      tabs: ['receive', 'send'],
      transactionInfoDialog: false,
      qrScannerDialog: false,
      qrDialog: false,
      formObject: {
        to: { address: null },
        amount: null,
        message: '',
        sender: null,
      },
      selectedTab: 1,
      selectedAccount: {},
      qrReadingError: false,
    };
  },
  mounted () {
    if (this.$route.params.wallet) {
      this.selectedAccount = this.wallets.find(
        x => x.name === this.$route.params.wallet
      );
    }
    this.$router.replace({ query: { tab: this.tabs[this.tabs.length - 1] } });
    if (!this.selectedAccount.address) this.selectedAccount = this.accounts[0];
  },
  computed: {
    ...mapGetters(['accounts', 'fee']),
    active () {
      return this.$route.query.tab;
    },
  },
  methods: {
    ...mapActions(['sendCoins', 'updateAccounts']),
    scanQR () {
      window.vueInstance = this; //Don't remove this for flutter app
      const self = this;
      window.flutter_inappwebview
        .callHandler('SCAN_QR')
        .then(function (result) {
          self.onDecode(result);
        });
    },
    onDecode (code) {
      var url = new URL(code);
      var tftAddress = url.hostname;

      if (tftAddress === '') {
        tftAddress = url.pathname.replace('//', '');
      }
      this.formObject.to.address = tftAddress;
      this.formObject.amount =
        url.searchParams.get('amount') == 'null'
          ? ''
          : url.searchParams.get('amount');
      this.formObject.message =
        url.searchParams.get('message') == 'null'
          ? ''
          : url.searchParams.get('message');
      this.formObject.sender =
        url.searchParams.get('sender') == 'null'
          ? ''
          : url.searchParams.get('sender');
    },
    getQueryVar (url, varName) {
      var val;
      url = new URL(url);
      if (varName === 'HOST') {
        val = url.pathname.replace('//', '');
      } else {
        val = url.searchParams.get(varName);
      }
      return val;
    },
    transferConfirmed () {
      if (!this.checkForm()) {
        console.log('form not valid');
        return;
      }
      if (this.active === 'receive') {
        this.qrDialog = true;
      } else if (this.active == 'send') {
        this.transactionInfoDialog = true;
      }
    },
    async send () {
      const transactiondata = {
        sourceKeyPair: this.selectedAccount.keyPair,
        destination: this.formObject.to.address,
        message: this.formObject.message,
        amount: this.formObject.amount.toFixed(3),
      };

      console.log(transactiondata);
      await doPayment(transactiondata);

      this.formObject = {
        to: { address: null },
        amount: null,
        message: null,
        sender: null,
      };
      this.$refs.formComponent.$refs.form.reset();

      this.$router.push({
        name: this.$route.meta.history,
        params: { wallet: this.selectedAccount.name },
      });
    },
    selectAccount (account) {
      this.selectedAccount = account;
      this.formObject = {
        to: { address: null },
        amount: null,
        message: null,
        sender: null,
      };
      this.$refs.formComponent.$refs.form.reset();
    },
    checkForm () {
      return this.$refs.formComponent.$refs.form.validate();
    },
    closeTransactionInfoDialog (save) {
      if (save) this.send();
      this.transactionInfoDialog = false;
    },
    closeQrScannerDialog () {
      this.qrScannerDialog = false;
    },
    closeQrDialog () {
      this.qrDialog = false;
    },
  },
  watch: {},
};