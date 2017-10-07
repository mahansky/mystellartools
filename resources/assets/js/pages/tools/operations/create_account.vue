<template>
    <div>
        <table class="single-operation">
            <tr>
                <td><b>Funder</b></td>
                <td><span v-text="operation.funder"></span></td>
            </tr>
            <tr>
                <td><b>Starting balance</b></td>
                <td><span v-html="amountFormat(operation.starting_balance)"></span> XLM</td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['operation']
  }
</script>