<template>
    <component :is="tag">
        <span v-text="firstPart">
        </span><small v-if="secondPart" v-text="'.' + secondPart">
        </small><span v-if="suffix" v-text="suffix"></span>
    </component>
</template>

<script>
  import BigNumber from 'bignumber.js'

  export default {
    props: {
      amount: {
        required: true,
      },
      tag: {
        default: 'span',
      },
      suffix: {
        default: '',
      },
    },

    computed: {
      formattedAmount () {
        return new BigNumber(this.amount).toFormat()
      },

      firstPart () {
        return this.formattedAmount.split('.')[0]
      },

      secondPart () {
        let parts = this.formattedAmount.split('.')

        if (parts.length === 2) {
          return parts[1]
        }
      }
    },
  }
</script>