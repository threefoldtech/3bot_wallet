import toolbar from '../components/toolbar'
import bottomNav from '../components/bottomNav'
import createWalletDialog from '../components/createWallet'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    toolbar,
    bottomNav,
    createWalletDialog
  },
  mounted () {
  },
  data () {
    return {
      showCreateWalletDialog: false,
      hideSnackbarTimeout: 6000
    }
  },
  computed: {
    ...mapGetters([
      'informationMessage',
      'fatalError'
    ]),
    cssProps () {
      return {
        '--primary-color': this.$vuetify.theme.primary,
        '--accent-color': this.$vuetify.theme.accent,
        '--error-color': this.$vuetify.theme.error
      }
    }
  },
  methods: {
    ...mapActions([
      'createWallet',
      'setInformationMessage'
    ]),
    handleCTAClick (data) {
      if (this.$route.name === 'home') {
        this.showCreateWalletDialog = !this.showCreateWalletDialog
        if (data) this.createWallet(data)
      }
    }

  },
  watch: {
    informationMessage (val) {
      if (val) {
        setTimeout(() => {
          this.setInformationMessage('')
        }, this.hideSnackbarTimeout)
      }
    },
    fatalError (val) {
      console.error(`ERROR`, val)
      this.$router.push({
        name: 'error',
        query: { msg: val }
      })
    }
  }
}