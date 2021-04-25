<template>
  <div class="">
    <el-row :gutter="10" class="panel-group">
      <el-col span="24" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newdb')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="db" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              数据源中的库
            </div>
            <count-to :start-val="0" :end-val="chartData.dbNum" :duration="2600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="panel-group">
      <el-col span="24" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newtable')">
          <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="table" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              数据源中的表
            </div>
            <count-to :start-val="0" :end-val="chartData.tableNum" :duration="3000" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="panel-group">
      <el-col span="24" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newcol')">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="column" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              数据源中的列
            </div>
            <count-to :start-val="0" :end-val="chartData.columnNum" :duration="3200" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="panel-group">
      <el-col span="24" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newtag')">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="tag" class-name="card-panel-icon" />
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              数据源中的标注
            </div>
            <count-to :start-val="0" :end-val="chartData.tagNum" :duration="3600" class="card-panel-num" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    chartData: {
      type: Object,
      default: () => {
        ({
          dbNum: 47,
          tableNum: 623,
          columnNum: 12053,
          tagNum: 110847
        })
      }
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 2px;
  margin-bottom: 5px;
  .card-panel-col {
    margin-bottom: 8px;
  }

  .card-panel {
    height: 95px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 10px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
