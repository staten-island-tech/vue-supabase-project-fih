<template>
  <div id="colorPicker"></div>
  <div>
    <RouterLink to="/FishDescription">Next</RouterLink>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import iro from "@jaames/iro";

onMounted(() => {
  const colorPicker = new iro.ColorPicker("#colorPicker", {
    width: 200,
    color: "#ff0000",
    borderWidth: 1,
    borderColor: "#fff",
  });
  colorPicker.on("color:change", function (color) {
  var hex = colorPicker.color.hexString;
  console.log(color.hexString);
});
});

</script>

<style scoped></style>
