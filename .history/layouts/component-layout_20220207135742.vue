<template>
  <el-row class="tac">
    <el-col :span="4">
      <el-menu default-active="2" class="el-menu-vertical-demo">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>Components</span>
          </template>
          <el-menu-item-group title="Group One">
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item one</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
    </el-col>
    <el-col :span="20">
      <div class="y-body">
        <slot name="header" />
        <slot />
      </div>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { Location, Document, Menu as IconMenu, Setting } from "@element-plus/icons-vue";
</script>
<style scoped>
.y-body {
  padding: 4rem;
}
</style>
