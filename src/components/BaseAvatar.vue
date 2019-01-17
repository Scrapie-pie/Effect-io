<template lang="pug">
    .base-avatar
</template>


<script>
    export default {}
</script>

<style lang="scss">
    .base-avatar{
        $sz:calc-em(70);
        display:inline-block;
        vertical-align:middle;
        width:$sz;
        height:$sz;
        border-radius:50%;
        background-color:glob-color('info-light');
    }

</style>