<template>
  <el-row class="y-body">
    <el-col :span="4">
      <div>
        <el-autocomplete
          v-model="search"
          :fetch-suggestions="querySearch"
          placeholder="Find components"
          @select="handleSelect"
        />
        <el-menu class="y-menu" :default-openeds="defaultOpeneds" router>
          <el-sub-menu index="components">
            <template #title>
              <el-icon><icon-menu /></el-icon>
              <span>Components</span>
            </template>
            <el-menu-item v-for="item of components" :key="item" :index="item">
              {{ item }}
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
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
const { components } = data.value;
const defaultOpeneds = ["components"];
const search = ref("");
console.log(components);

const createFilter = (queryString: string) => {
  return (restaurant) => {
    return restaurant.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};
const querySearch = (queryString: string, cb: any) => {
  const results = queryString ? components.filter(createFilter(queryString)) : components;
  // call callback function to return suggestions
  cb(results);
};

const handleSelect = (item) => {
  console.log(item);
};
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
