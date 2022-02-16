<template>
  <el-row class="tac">
    <el-col :span="4">
      <el-menu
        default-active="components"
        class="el-menu-vertical-demo"
        default-openeds="['components']"
        router
      >
        <el-sub-menu index="components">
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>Components</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="item of componentsAST"
              :key="item.displayName"
              :index="item.displayName"
            >
              {{ item.displayName }}
            </el-menu-item>
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
const { componentsAST } = data.value;
console.log(componentsAST);
</script>
<style scoped>
.y-body {
  padding: 4rem;
}
</style>
