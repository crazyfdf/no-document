<template>
  <el-cascader :options="options" v-bind="componentProps">
    <template #default="{ node, data }">
      <span>{{ data.label }}</span>
      <span v-if="!node.isLeaf"> </span>
      <span v-else
        >{{ data.label }}
        <el-color-picker disabled />
      </span>
    </template>
  </el-cascader>
</template>
<script lang="ts" setup>
defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  componentProps: {
    type: Object,
    default: () => ({}),
  },
});
</script>
