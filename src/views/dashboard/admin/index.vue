<template>
  <div class="dashboard-editor-container">

    <el-row :gutter="18" style="margin-bottom:10px;">
      <el-col :xs="{span: 48}" :sm="{span: 36}" :md="{span: 36}" :lg="{span: 18}" :xl="{span: 18}">
        <panel-group @handleSetLineChartData="handleSetLineChartData" />
        <el-row style="background:#fff;padding:10px 16px 0;">
          <line-chart :chart-data="tempLineData" />
        </el-row>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 14}" :md="{span: 14}" :lg="{span: 6}" :xl="{span: 16}">
        <div class="chart-wrapper">
          <db-static :chart-data="dbStaticData" @handleSetLineChartData="handleSetLineChartData" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <tag-pie-chart />
        </div>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 8}" :xl="{span: 6}">
        <box-card />
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import DbStatic from './components/dbstatic'
import TagPieChart from './components/tagPieChart'
import * as dashborad from '@/api/dashborad'

const lineChartData = {
  newdb: {
    title: '数据源中的新增数据库',
    successData: [2, 0, 7, 3, 0, 1, 1],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  newtable: {
    title: '数据源中的新增数据表',
    successData: [20, 0, 72, 14, 0, 13, 4],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  newcol: {
    title: '数据源中的新增数据列',
    successData: [180, 0, 421, 104, 0, 104, 40],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  newtag: {
    title: '数据源中的新增数据标注',
    successData: [30, 40, 141, 142, 45, 50, 16],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    // GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard,
    DbStatic,
    TagPieChart
  },
  data() {
    return {
      tempLineData: {
        title: '任务统计信息',
        legendSus: '成功',
        legendFail: '失败',
        failData: [],
        successData: [],
        dayList: []
      },
      dbStaticData: {
        dbNum: 47,
        tableNum: 623,
        columnNum: 12053,
        tagNum: 38173
      }
    }
  },
  created() {
    this.chartInfo()
  },
  methods: {
    handleSetLineChartData(type) {
      this.tempLineData.legendSus = '新增'
      this.tempLineData.legendFail = ''
      this.tempLineData.title = lineChartData[type].title
      this.tempLineData.successData = lineChartData[type].successData
      this.tempLineData.failData = []
    },
    chartInfo() {
      dashborad.chartInfo().then(response => {
        const { content } = response
        this.tempLineData.successData = content.triggerDayCountSucList
        this.tempLineData.failData = content.triggerDayCountFailList
        this.tempLineData.dayList = content.triggerDayList
        localStorage.setItem('countSucTotal', content.triggerCountSucTotal)
        localStorage.setItem('countRunningTotal', content.triggerCountRunningTotal)
        localStorage.setItem('countFailTotal', content.triggerCountFailTotal)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 10px 10px;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
