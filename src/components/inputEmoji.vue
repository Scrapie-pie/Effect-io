
<script>
    import lodash_split from 'lodash/split'
export default {
    props:['text'],
    render(h){
        console.log(lodash_split(this.text,''));
        let splitStr = lodash_split(this.text,'')
        splitStr = splitStr.map(item=>{
            if (item.length>1) { item = (<img alt={item}/>) }
            return item
        })
        return (


        <div contenteditable="true">{splitStr}</div>
        )
    }
}
</script>

<style lang="scss">

</style>