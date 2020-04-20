<template>
  <!-- <div id="app"> -->
  <router-view />
  <!-- </div> -->
</template>
<script>
export default {
  data: () => ({
    image: "https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
  })
};
</script>
<style>
#inspire img {
  height: 100%;
}

select {
  -webkit-writing-mode: horizontal-tb !important;
  -webkit-appearance: menulist;
  -webkit-rtl-ordering: logical;
  cursor: default;
  margin: 0em;
  font: 400 13.3333px Arial;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(169, 169, 169);
  border-image: initial;
  height: 25px;
}
.txtRequired {
  border: 1px solid red;
  border-radius: 4px;
}

.txtRight {
  text-align: right !important;
}
.txtLeft {
  text-align: left !important;
}
.txtCenter {
  text-align: center !important;
}

/* Table  */
.csmTable {
  border-collapse: collapse;
  width: 100%;
}
.csmTable td,
.csmTable th {
  border: 1px solid #ddd;
  padding: 3px;
}
.csmTable tr:nth-child(even) {
  background-color: #f2f2f2;
}
.csmTable th {
  text-align: left;
  background-color: white;
  color: black;
  cursor: pointer;
}

.csmTable th i {
  text-align: right;
}
</style>