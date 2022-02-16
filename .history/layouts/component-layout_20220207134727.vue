<template>
  <YMenu :model="items" />
  <div class="y-body">
    <slot name="header" />
    <slot />
  </div>
</template>
<script lang="ts" setup>
import YMenu from "primevue/menu";
const items = ref([
  {
    label: "Navigate",
    items: [
      {
        label: "Vue Website",
        icon: "pi pi-external-link",
        url: "https://vuejs.org/",
      },
      {
        label: "Router",
        icon: "pi pi-upload",
        command: () => {
          window.location.hash = "/fileupload";
        },
      },
    ],
  },
]);
</script>
<style scoped>
.y-body {
  padding: 4rem;
}
</style>
