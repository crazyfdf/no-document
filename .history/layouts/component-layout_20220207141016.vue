<template>
  <el-row class="tac">
    <el-col :span="4">
      <el-menu default-active="1" class="el-menu-vertical-demo">
        <el-sub-menu index="1">
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>Components</span>
          </template>
          <el-menu-item-group title="Group One">
            <el-menu-item v-for="item of data" :key="item.displayName" :index="item.displayName">{{
              item.displayName
            }}</el-menu-item>
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
import { Menu as IconMenu } from "@element-plus/icons-vue";
const { data } = await useFetch("/api/components");
console.log(data.value);
</script>
<style scoped>
.y-body {
  padding: 4rem;
}
</style>
