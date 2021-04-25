<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '395px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: { text: '全库各数据类型占比' },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['mysql', 'oracle', 'postgresql', 'sqlserver', 'hive', 'hbase', 'mongondb', 'clickhouse']
        },
        series: [
          {
            name: '',
            type: 'pie',
            roseType: 'radius',
            radius: [20, 90],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: 'mysql' },
              { value: 240, name: 'oracle' },
              { value: 200, name: 'mongondb' },
              { value: 149, name: 'postgresql' },
              { value: 100, name: 'sqlserver' },
              { value: 80, name: 'hbase' },
              { value: 59, name: 'hive' },
              { value: 90, name: 'clickhouse' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
