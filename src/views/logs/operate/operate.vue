<template>
  <div class="app-container">
    <el-row :gutter="4">
      <el-col :span="4">
        <div class="grid-content bg-purple">日志数据源</div>
      </el-col>
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
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content ">
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            @click="getLogJson()"
          />
        </div>
      </el-col>
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
    DrawGraph: () => import('@/components/D3Draw/DrawGraph')
  },
  data() {
    return {
      show: false,
      refleshgraph: 1,
      tableData: [],
      logresult: '',
      page: {
        // model: 2,
        all: false,
        index: 1,
        limit: 10
      },
      params: {
        filename: '',
        linenum: '100'
      },
      value: ''
    }
  },
  computed: {
    // 滚动区高度
    scrollerHeight: function() {
      return (window.innerHeight - 100) + 'px'
    }
  },

  mounted: function() {
    this.getList()
  },
  methods: {
    setCurrent(val) {
      this.params.filename = val
      console.log(val)
    },
    getList() {
      console.log('getList')
      fetchList(this.page).then((response) => {
        console.log(response)
        this.tableData = response.items
      })
    },
    getLogJson() {
      analysisLog(this.params).then((response) => {
        console.log(response)
        this.logresult = response.jsonfiles[0]
        this.show = true
        this.refleshgraph += 1
      })
    }
  }
}
</script>
<style scoped>
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  text-align: center;
  line-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>