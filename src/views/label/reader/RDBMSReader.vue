<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content bg-purple">数据库源</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          <el-select v-model="readerForm.datasourceId" clearable filterable placeholder="请选择" @change="rDsChange">
            <el-option
              v-for="item in rDsList"
              :key="item.id"
              :label="item.datasourceName"
              :value="item.id"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :span="16">
        <div class>
          <DataTag :dynamic-tags="dataTags.database" />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content bg-purple">数据库表名</div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          <el-select v-model="readerForm.tableName" allow-create clearable filterable placeholder="请选择" @change="rTbChange">
            <el-option v-for="item in rTbList" :key="item" :label="item" :value="item" />
          </el-select>
        </div>
      </el-col>
      <el-col :span="16">
        <div class>
          <DataTag :dynamic-tags="dataTags.table" />
        </div>
      </el-col>
    </el-row>
    <el-table :data="columns" style="width: 100%">
      <el-table-column label="表所有字段" align="center">
        <el-table-column prop="name" label="字段名" width="100" align="center" />
        <el-table-column prop="tags" label="标签" align="center">
          <template slot-scope="{ row }">
            <DataTag :dynamic-tags="row.tags" />
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-form label-position="right" label-width="120px" :model="readerForm" :rules="rules">
      <el-form-item
        v-show="
          dataSource === 'postgresql' ||
            dataSource === 'oracle' ||
            dataSource === 'sqlserver'
        "
        label="Schema："
        prop="tableSchema"
      >
        <el-select v-model="readerForm.tableSchema" allow-create default-first-option filterable style="width: 300px" @change="schemaChange">
          <el-option v-for="item in schemaList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as dsQueryApi from '@/api/metadata-query'
import { list as jdbcDsList } from '@/api/datax-jdbcDatasource'
import Bus from '../busReader'
import DataTag from '../components/datatag'
export default {
  name: 'RDBMSReader',
  components: { DataTag },
  data() {
    return {
      dataTags: {
        database: ['数据库'],
        table: ['表']
      },
      columns: [],
      jdbcDsQuery: {
        current: 1,
        size: 200,
        ascs: 'datasource_name'
      },
      rDsList: [],
      rTbList: [],
      schemaList: [],
      rColumnList: [],
      loading: false,
      active: 1,
      customFields: '',
      customType: '',
      customValue: '',
      dataSource: '',
      readerForm: {
        datasourceId: undefined,
        tableName: '',
        columns: [],
        where: '',
        querySql: '',
        checkAll: false,
        isIndeterminate: true,
        splitPk: '',
        tableSchema: ''
      },
      rules: {
        datasourceId: [
          { required: true, message: 'this is required', trigger: 'change' }
        ],
        tableName: [
          { required: true, message: 'this is required', trigger: 'change' }
        ],
        tableSchema: [
          { required: true, message: 'this is required', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'readerForm.datasourceId': function(oldVal, newVal) {
      if (
        this.dataSource === 'postgresql' ||
        this.dataSource === 'oracle' ||
        this.dataSource === 'sqlserver'
      ) {
        this.getSchema()
      } else {
        this.getTables('rdbmsReader')
      }
    }
  },
  created() {
    this.getJdbcDs()
  },
  methods: {
    // 获取可用数据源
    getJdbcDs(type) {
      this.loading = true
      jdbcDsList(this.jdbcDsQuery).then((response) => {
        const { records } = response
        this.rDsList = records
        this.loading = false
      })
    },
    // 获取表名
    getTables(type) {
      if (type === 'rdbmsReader') {
        let obj = {}
        if (
          this.dataSource === 'postgresql' ||
          this.dataSource === 'oracle' ||
          this.dataSource === 'sqlserver'
        ) {
          obj = {
            datasourceId: this.readerForm.datasourceId,
            tableSchema: this.readerForm.tableSchema
          }
        } else {
          obj = {
            datasourceId: this.readerForm.datasourceId
          }
        }
        // 组装
        dsQueryApi.getTables(obj).then((response) => {
          if (response) {
            this.rTbList = response
          }
        })
      }
    },
    getSchema() {
      const obj = {
        datasourceId: this.readerForm.datasourceId
      }
      dsQueryApi.getTableSchema(obj).then((response) => {
        this.schemaList = response
        console.log(response)
      })
    },
    // schema 切换
    schemaChange(e) {
      this.readerForm.tableSchema = e
      // 获取可用表
      this.getTables('rdbmsReader')
    },
    // reader 数据源切换
    rDsChange(e) {
      // 清空
      this.readerForm.tableName = ''
      this.readerForm.datasourceId = e
      this.rDsList.find((item) => {
        if (item.id === e) {
          this.dataSource = item.datasource
        }
      })
      Bus.dataSourceId = e
      this.$emit('selectDataSource', this.dataSource)
    },
    getTableColumns() {
      const obj = {
        datasourceId: this.readerForm.datasourceId,
        tableName: this.readerForm.tableName
      }
      dsQueryApi
        .getColumns(obj)
        .then((response) => {
          this.rColumnList = response
          this.readerForm.columns = response
          this.readerForm.checkAll = true
          this.readerForm.isIndeterminate = false
        })
        .then(() => {
          this.rColumnList.forEach((item) => {
            const gobj = {
              name: item,
              tags: [item]
            }
            this.columns.push(gobj)
          })
        })
    },
    getColumnsByQuerySql() {
      const obj = {
        datasourceId: this.readerForm.datasourceId,
        querySql: this.readerForm.querySql
      }
      dsQueryApi.getColumnsByQuerySql(obj).then((response) => {
        this.rColumnList = response
        this.readerForm.columns = response
        this.readerForm.checkAll = true
        this.readerForm.isIndeterminate = false
      })
    },
    // 获取表字段
    getColumns(type) {
      if (type === 'reader') {
        if (this.readerForm.querySql !== '') {
          this.getColumnsByQuerySql()
        } else {
          this.getTableColumns()
        }
      }
    },
    // 表切换
    rTbChange(t) {
      this.readerForm.tableName = t
      this.rColumnList = []
      this.readerForm.columns = []
      this.getColumns('reader')
      this.columns = []
    },
    rHandleCheckAllChange(val) {
      this.readerForm.columns = val ? this.rColumnList : []
      this.readerForm.isIndeterminate = false
    },
    rHandleCheckedChange(value) {
      const checkedCount = value.length
      this.readerForm.checkAll = checkedCount === this.rColumnList.length
      this.readerForm.isIndeterminate =
        checkedCount > 0 && checkedCount < this.rColumnList.length
    },
    getData() {
      if (Bus.dataSourceId) {
        this.readerForm.datasourceId = Bus.dataSourceId
      }
      return this.readerForm
    }
  }
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
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
