<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="3">
        <div class="grid-content bg-purple">日志数据源</div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content ">
          <el-select v-model="currentvalue1" placeholder="请选择" @change="setCurrent1">
            <el-option
              v-for="item in tableData"
              :key="item.pk"
              :label="item.fields.name"
              :value="item.fields.file"
            />
          </el-select></div></el-col>
      <el-col :span="4">
        <div>
          <el-slider v-model="valuerange1" range :max="100" /></div></el-col>

      <el-col :span="3">
        <div class="grid-content bg-purple">日志数据源</div>
      </el-col>
      <el-col :span="3">
        <div class="grid-content ">
          <el-select v-model="currentvalue2" placeholder="请选择" @change="setCurrent2">
            <el-option
              v-for="item in tableData"
              :key="item.pk"
              :label="item.fields.name"
              :value="item.fields.file"
            />
          </el-select></div></el-col>
      <el-col :span="4">
        <div>
          <el-slider v-model="valuerange2" range :max="100" /></div></el-col>
      <el-col :span="4">
        <div class="grid-content ">
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            @click="getLogJson()"
          /></div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="graph" :style="{'margin-top': '10px', 'height':scrollerHeight}">
          <DrawGraph v-if="show" :key="refleshgraph" :filename="logresult1" :width="98" :height="100" />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="graph" :style="{'margin-top': '10px', 'height':scrollerHeight}">
          <DrawGraph v-if="show" :key="refleshgraph" :filename="logresult2" :width="98" :height="100" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchList, analysisLog } from '@/api/logs'
export default {
  components: {
    DrawGraph: () => import('@/components/D3Draw/DrawGraph.vue')
  },
  data() {
    return {
      show: false,
      refleshgraph: 1,
      currentfile1: '',
      currentfile2: '',
      tableData: [],
      logresult1: '',
      logresult2: '',
      currentvalue1: '',
      currentvalue2: '',
      valuerange1: [0, 50],
      valuerange2: [0, 50],
      range1: 50,
      range2: 50,
      page: {
        all: true,
        index: 1,
        limit: 10
      },
      params: {
        filename: '',
        linenum: '100'
      }
    }
  },
  computed: {
    // 滚动区高度
    scrollerHeight: function() {
      return (window.innerHeight - 100) + 'px'
    }
  },
  mounted: function() {
    this.showLogsList()
  },
  methods: {
    setCurrent1(val) {
      this.currentfile1 = val
      console.log(val)
    },
    setCurrent2(val) {
      this.currentfile2 = val
      console.log(val)
    },
    showLogsList() {
      fetchList(this.page).then((response) => {
        this.tableData = response.items
      })
    },
    getLogJson() {
      this.params.filename = this.currentfile1
      this.params.linenum = Math.abs(this.valuerange1[1] - this.valuerange1[0])
      analysisLog(this.params).then((response) => {
        this.logresult1 = response.jsonfiles[0]
        this.params.filename = this.currentfile2
        this.params.linenum = Math.abs(this.valuerange2[1] - this.valuerange2[0])
        analysisLog(this.params).then((response) => {
          this.logresult2 = response.jsonfiles[0]
          this.show = true
          this.refleshgraph += 1
        })
      })
    }
  }
}
</script>
<style scoped>
.graph{
    border:solid 1px rgb(25, 143, 255);
}
</style>
