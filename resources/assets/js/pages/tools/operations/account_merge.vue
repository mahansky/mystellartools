<template>
    <div>
        <table class="first-padding">
            <tr>
                <td><b>Into</b></td>
                <td><span v-text="operation.into"></span></td>
            </tr>
        </table>
    </div>
</template>

<script>
  export default {
    props: ['operation']
  }
</script>