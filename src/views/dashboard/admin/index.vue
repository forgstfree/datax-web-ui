<template>
  <div class="dashboard-editor-container">

    <el-row :gutter="18" style="margin-bottom:32px;">
      <el-col :xs="{span: 48}" :sm="{span: 36}" :md="{span: 36}" :lg="{span: 18}" :xl="{span: 18}">
        <panel-group @handleSetLineChartData="handleSetLineChartData" />
        <el-row style="background:#fff;padding:16px 16px 0;">
          <line-chart :chart-data="lineChartData" />
        </el-row>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}">
        <box-card />
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="{span: 46}" :sm="{span: 34}" :md="{span: 34}" :lg="{span: 16}" :xl="{span: 16}">
        <div class="chart-wrapper">
          <bar-chart :chart-data="barChartData"/>
        </div>
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
import * as dashborad from '@/api/dashborad'

const lineChartData = {
  chartInfo: {
    failData: [],
    successData: [],
    dayList: []
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    //GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.chartInfo,
      barChartData: lineChartData.chartInfo
    }
  },
  created() {
    this.chartInfo()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    chartInfo() {
      dashborad.chartInfo().then(response => {
        const { content } = response
        this.lineChartData.successData = content.triggerDayCountSucList
        this.lineChartData.failData = content.triggerDayCountFailList
        this.lineChartData.dayList = content.triggerDayList
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
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
