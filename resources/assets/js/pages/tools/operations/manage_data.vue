<template>
    <div>
        <table class="single-operation">
            <tr>
                <td><b>Key</b></td>
                <td><span v-text="operation.name"></span></td>
            </tr>
            <tr>
                <td><b>Value</b></td>
                <td>
                    <span v-text="decode64(operation.value)"></span>
                    <span v-text="operation.value" class="pl-3 grey--text"></span>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['operation'],

    methods: {
      decode64 (value) {
        return window.atob(value)
      }
    }
  }
</script>