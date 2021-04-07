<template>
    <div class="container">
        <h1> {{ title }} </h1>
        <p> I'm is a p biaoqian </p>
    </div>
</template>

<script>
export default {
    name: 'MyFirstCom',
    props: {
        title: {
            type:String,
            default:"My first title."
        }
    },
    data () {
        return {
            innnertitle:String,
        }
    },
    mounted () {
        console.log("组件挂载时数据的内部拷贝")
        this.innnertitle = this.title
    }
}
</script>