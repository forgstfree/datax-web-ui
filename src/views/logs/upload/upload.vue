<template>
  <div class="upload-container">
    <el-upload
      ref="upload"
      style="height: 300px"
      class="upload-demo"
      :data="dataObj"
      :action="uploadurl"
      :multiple="false"
      :auto-upload="false"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    </el-upload>
    <div>
      <el-input v-model="input1" placeholder="请输入内容">
        <template slot="prepend">文件名:</template>
        <template slot="append">
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
        </template>
      </el-input>
    </div>
    <el-input v-model="uploadtip" placeholder="文件未上传" clearable />
    <!-- <el-button
      type="success"
      plain
      :disabled="isdisabled"
      @click="watchAnalysis"
      >查看分析结果</el-button
    > -->
  </div>
</template>

<script>
export default {
  name: 'SingleFileUpload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadurl: process.env.VUE_APP_BASE_URL + '/dblog/upload/',
      input1: '',
      isdisabled: false,
      uploadtip: '',
      scrfToken: '',
      dataObj: { name: '', num: '' }
    }
  },
  computed: {},
  mounted: function() {
    //      this.getcsrftoken()
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    getcsrftoken() {
      console.log('cookie:' + document.cookie)
    },

    beforeUpload(file) {
      this.uploadtip = '文件正在上传中。。。'
      if (this.input1 === null) this.dataObj['name'] = file.name
      else this.dataObj['name'] = this.input1
      this.input1 = null
    },

    uploadSuccess(response, file, fileList) {
      console.log('on-success')
      this.uploadtip = '文件已成功上传'
      if (response['error_num'] === 0) {
        this.isdisabled = false
        // this.uploadtip = '文件已成功上传,并分析完成。'
      } else {
        this.uploadtip = '文件未成功上传，请稍后重试。'
      }
    },
    watchAnalysis() {
      console.log('查看分析结果')
      this.$router.push({ name: 'Operate', query: { id: this.isdisabled }})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.upload-container {
  width: 100%;
  position: relative;
  @include clearfix;
  .file-uploader {
    width: 100%;
    float: left;
  }
}
.demo-block {
  margin-bottom: 24px;
}

.demo-block .upload-demo {
  width: 360px;
}
</style>
