<template>
  <el-row class="y-body">
    <el-col :span="4">
      <el-menu class="y-menu" :default-openeds="defaultOpeneds" router>
        <el-sub-menu index="components">
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>Components</span>
          </template>
          <el-menu-item
            v-for="item of componentsAST"
            :key="item.displayName"
            :index="item.displayName"
          >
            {{ item.displayName }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <div class="y-main">
        <slot name="header" />
        <slot />
      </div>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { Menu as IconMenu } from "@element-plus/icons-vue";
const { data } = await useFetch("/api/components");
const { componentsAST } = data.value;
const defaultOpeneds = ["components"];
</script>
<style scoped>
.y-body {
  height: 100vh;
}
.y-menu {
  height: 100%;
}
.y-main {
  padding: 4rem;
}
</style>
