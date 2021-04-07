<template>
  <div id="app">
    <el-row class="block-col-2">
      <el-col :span="12">
        <el-dropdown>
          <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">-1ubuntu.log</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">100</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus-outline">1000</el-dropdown-item>
            <el-dropdown-item icon="el-icon-check">ER对照图1</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-check"> ER对照图2</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="12">
        <el-button type="primary" plain>更新</el-button>
      </el-col>
    </el-row>
    <button @click="changeTitle">修改title</button>
    <p> {{ title }} </p>
    <!-- 父子组件动态传值需要进行v-bind -->
    <!--    <MyComponent v-bind:title="title"/>-->
    <DrawGraph :height="height" :width="width" />
    <!-- <DrawGraphTwo :height="height" :width="width" /> -->
    <!--    <MyComponent title="title"/>-->

  </div>
</template>

<script>
// import MyComponent from './components/MyFirstComponent'
// import DrawGraph from '@/components/D3Draw/DrawGraph'
import DrawGraph from './components/DrawGraph'
// import DrawGraphTwo from './components/DrawGraphTwo'

export default {
  name: 'App',
  components: {
    // MyComponent,
    DrawGraph
    // DrawGraphTwo
  },
  data() {
    return {
      title: '我的组件在App中被调用了',
      width: 600,
      height: 700
    }
  },
  methods: {
    changeTitle() {
      this.title = '我被改变了，两个组件都变了吗'
      this.width += 300
      this.height += 400
    }
  }
}
</script>

<style scoped>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }

    .demonstration {
        display: block;
        color: #8492a6;
        font-size: 14px;
        margin-bottom: 20px;
    }
</style>
