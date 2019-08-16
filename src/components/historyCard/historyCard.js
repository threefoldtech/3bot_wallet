import amountIndicator from '../amountIndicator'
import copy from 'clipboard-copy'

export default {
  name: 'history-card',
  components: { amountIndicator },
  props: [
    'transaction'
  ],
  data () {
    return {
      outgoing: false,
      valuta: 'tft',
      show: false
    }
  },
  computed: {
    amount () {
      if (this.transaction) {
        if (this.transaction.inputs && this.transaction.inputs.length) {
          this.outgoing = false
          return this.sumTransactionAmount(this.transaction.inputs)
        } else if (this.transaction.outputs && this.transaction.outputs.length) {
          this.outgoing = true
          return '-' + this.sumTransactionAmount(this.transaction.outputs)
        }
      } else {
        return '---'
      }
    },
    receiver () {
      if (!this.transaction.confirmed) return 'Pending transaction...'
      var receiverName = this.getWalletAddresRecipient()
      return receiverName
    },
    sender () {
      if (!this.transaction.confirmed) return 'Pending transaction...'
      var senderAddress = this.getWalletAddresSender()
      return senderAddress
    },
    timeStamp () {
      var date = new Date(0)
      date.setUTCSeconds(this.transaction.timestamp)
      return date.toLocaleDateString()
    },
    fee () {
      var total = 0
      var fees = this.transaction.outputs.filter(x => x.is_fee)
      fees.forEach(fee => {
        var amount = fee.amount.str({ precision: 3 }).replace(',', '')
        total += parseFloat(amount)
      })
      return total.toLocaleString('nl-BE', { minimumFractionDigits: 2, useGrouping: false })
    }
  },
  mounted () {

  },
  methods: {
    getWalletAddresRecipient () {
      var address = null
      if (this.transaction.inputs && this.transaction.inputs.length) {
        var input = this.transaction.inputs.find(x => !x.fee)
        if (input) address = input.recipient
      } else {
        var output = this.transaction.outputs.find(x => !x.fee)
        if (output) address = output.recipient 
      }
      return address
    },
    getWalletAddresSender () {
      var address = null
      if (this.transaction.outputs && this.transaction.outputs.length) {
        var output = this.transaction.outputs.find(x => !x.fee)
        if (output) address = output.senders[0]
      }  else {
        var input = this.transaction.inputs.find(x => !x.fee)
        if (input) address = input.senders[0]
      }
      return address
    },
    sumTransactionAmount (arr) {
      var total = 0
      arr.forEach(output => {
        var amount = output.amount.str({ precision: 3 }).replace(',', '')
        total += parseFloat(amount)
      })
      return total.toLocaleString('nl-BE', { minimumFractionDigits: 2, useGrouping: false })
    },
    copyTransaction () {
      copy(JSON.stringify(this.transaction))
    },
    isJsonObject (obj) {
      try {
        JSON.parse(obj)
        return true
      } catch (e) {
        return false
      }
    }
  }
}
