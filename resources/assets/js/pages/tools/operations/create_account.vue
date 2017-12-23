<template>
    <div>
        <table class="first-padding">
            <tr>
                <td><b>Account</b></td>
                <td><span v-text="operation.account"></span></td>
            </tr>
            <tr>
                <td><b>Starting balance</b></td>
                <td><amount :amount="operation.starting_balance"></amount> XLM</td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['operation']
  }
</script>