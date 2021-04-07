<template>
    <el-row class="block-col-2">
        <el-col :span="12">
            <span class="demonstration">hover 激活</span>
            <el-dropdown>
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-plus-outline">螺蛳粉</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-check">双皮奶</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-check">蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
        <el-col :span="12">
            <span class="demonstration">click 激活</span>
            <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-plus-outline">螺蛳粉</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-check">双皮奶</el-dropdown-item>
                    <el-dropdown-item icon="el-icon-circle-check">蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "downdraw"
    }
</script>

<style scoped>

</style>