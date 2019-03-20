
<script>

export default {
    render(h){


        function bem(string) {
            let className = 'table'
            if (string) className+='__'+string
            return className
        }
        function bemClass(item) {
            let data ={staticClass:bem(item.tag)}
            if(item.data && item.data.staticClass) item.data.staticClass +=' '+data.staticClass
            else if(item.data && !item.data.staticClass)item.data.staticClass = data.staticClass
            else if (!item.data) item.data=data
            return item
        }
        
        function rec(item) {
            if(!item.tag) return item
            item = bemClass(item);
            if(!item.children) return item
            item.children.forEach(itemSub=>rec(itemSub))
            return item
        }

        let trs = this.$slots.default.map(item =>rec(item))

        return h('table', {class: bem()}, [trs])
    },

}
</script>

<style lang="scss">
    .table-row{}
</style>