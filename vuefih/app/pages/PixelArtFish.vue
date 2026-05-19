<template>
<div id="colorPicker"></div>
<div>
<RouterLink to="/PixelArtFish">Aquarium</RouterLink>
<script src="https://cdn.jsdelivr.net/npm/@jaames/iro@5"></script>
<script>
  const colorPicker = new iro.ColorPicker("#colorPicker", {
    width: 200,       
    color: "#ff0000", 
    borderWidth: 1,
    borderColor: "#fff"
  });
  colorPicker.on("color:change", function(color) {
    console.log(color.hexString); 
  });
  </script>
</div>
</template>

<script setup>

</script>

<style scoped>

</style>