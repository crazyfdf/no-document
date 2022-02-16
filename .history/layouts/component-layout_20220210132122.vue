<template>
  <el-row class="y-body">
    <el-col :span="4">
      <el-menu class="y-menu" :default-openeds="defaultOpeneds" router>
        <el-menu-item>
          <template #title>
            <el-autocomplete
              v-model="search"
              :fetch-suggestions="querySearch"
              placeholder="Find components"
              @select="handleSelect"
            />
          </template>
        </el-menu-item>
        <el-sub-menu index="components">
          <template #title>
            <el-icon><icon-menu /></el-icon>
            <span>Components</span>
          </template>
          <el-menu-item v-for="item of restaurants" :key="item.value" :index="item.value">
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
import { Menu as IconMenu } from "@element-plus/icons-vue";
const { data } = await useFetch("/api/components");
const defaultOpeneds = ["components"];
const search = ref("");

interface RestaurantItem {
  value: string;
}
const restaurants = ref<RestaurantItem[]>([]);
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
  };
};
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value;
  // call callback function to return suggestions
  cb(results);
};

const handleSelect = (item: RestaurantItem) => {
  console.log(item);
};
onMounted(() => {
  restaurants.value = data.value.componentsAST.map((item) => ({ value: item.value }));
});
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
