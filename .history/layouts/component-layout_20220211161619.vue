<template>
  <el-row class="y-body">
    <el-col class="y-nav" :span="4">
      <el-menu class="y-menu" :default-openeds="defaultOpeneds" router>
        <el-menu-item index="">
          <client-only>
            <el-autocomplete
              style="width: 100%"
              v-model="search"
              :fetch-suggestions="querySearch"
              placeholder="Find components"
              @select="handleSelect"
              :suffix-icon="Search"
            />
          </client-only>
        </el-menu-item>
        <el-sub-menu index="components">
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>Components</span>
          </template>
          <el-menu-item v-for="item of restaurants" :key="item.value" :index="item.link">
            {{ item.value }}
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
import { Menu as IconMenu, Search } from "@element-plus/icons-vue";
const { data } = await useFetch("/api/components");
const { components } = data.value;
const defaultOpeneds = ["components"];
const search = ref("");
const restaurants = ref(components);

const createFilter = (queryString: string) => {
  return (restaurant) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};
const querySearch = (queryString: string, cb: any) => {
  restaurants.value = queryString ? components.filter(createFilter(queryString)) : components;
  cb(restaurants.value);
};

const handleSelect = (item) => {
  restaurants.value = [item];
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
.y-nav {
  overflow-y: scroll;
  background: rgb(246, 249, 252);
}
</style>
