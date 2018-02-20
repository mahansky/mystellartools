<template>
    <div>
        <div class="subheading grey--text text--darken-2" v-html="price + ' ' + selected.toUpperCase()"></div>
        <div class="grey--text">
            <small
                    class="mr-1 ml-1 pointer"
                    v-for="currency in currencies"
                    v-text="currency"
                    :key="currency"
                    :class="{'blue--text': selected.toUpperCase() === currency}"
                    @click="change(currency)">
            </small>
        </div>
    </div>
</template>

<script>
  import BigNumber from 'bignumber.js'
  import axios from 'axios'

  export default {
    props: ['lumens'],

    data () {
      return {
        currencies: ['BTC', 'USD', 'EUR', 'GBP'],
        selected: 'usd',
        prices: {},
      }
    },

    computed: {
      price () {
        let number = 0

        if (Object.keys(this.prices).length) {
          number = (new BigNumber(this.lumens)).times(new BigNumber(this.prices[this.selected]))

          if (this.selected === 'btc') {
            return number.toFixed(8)
          }
        }

        return number.toFixed(2)
      }
    },

    created () {
      let vm = this

      axios.get('/api/prices')
        .then(response => {
          vm.prices = response.data.prices
        })
    },

    methods: {
      change (currency) {
        this.selected = currency.toLowerCase()
      }
    }
  }
</script>