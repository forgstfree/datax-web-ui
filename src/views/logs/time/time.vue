<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content ">
          <el-select v-model="value" placeholder="请选择" @change="setCurrent">
            <el-option
              v-for="item in tableData"
              :key="item.pk"
              :label="item.fields.name"
              :value="item.fields.file"
            />
          </el-select>
        </div></el-col>
      <el-col :span="6">
        <div>
          <el-slider v-model="value1" range :max="100" />
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content ">
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            @click="getLogJson()"
          /></div></el-col>
    </el-row>
    <div ref="graph" :style="{'margin-top': '10px', 'height':scrollerHeight}">
      <DrawGraph v-if="show" :key="refleshgraph" :filename="logresult" :width="100" :height="100" />
    </div>
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
      currentfile: '',
      tableData: [],
      logresult: '',
      value: '',
      value1: [0, 50],
      range1: 100,
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
    setCurrent(val) {
      this.params.filename = val
      console.log(val)
    },
    showLogsList() {
      fetchList(this.page).then((response) => {
        this.tableData = response.items
      })
    },
    getLogJson() {
      this.params.linenum = Math.abs(this.value1[1] - this.value1[0])
      analysisLog(this.params).then((response) => {
        this.logresult = response.jsonfiles[0]
        this.show = true
        this.refleshgraph += 1
      })
    }
  }
}
</script>
