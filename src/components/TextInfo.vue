<template lang="pug">
    p.text-info
        slot
</template>
<script>
export default {
    name: 'TextInfo'
}
</script>
<style lang="scss">
.text-info {
    color: glob-color('info-dark');
}
</style>
