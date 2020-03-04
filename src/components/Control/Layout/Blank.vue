<template>
  <div>
    <h1>Blank</h1>

    <div id="standalone-container">
      <div id="toolbar-container">
        <span class="ql-formats">
          <select class="ql-font">
            <option selected>Sans Serif</option>
            <option value="inconsolata">Inconsolata</option>
            <option value="roboto">Roboto</option>
            <option value="mirza">Mirza</option>
            <option value="arial">Arial</option>
          </select>
          <select class="ql-size"></select>
        </span>
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
          <button class="ql-strike"></button>
        </span>
        <span class="ql-formats">
          <select class="ql-color"></select>
          <select class="ql-background"></select>
        </span>
        <span class="ql-formats">
          <button class="ql-blockquote"></button>
          <button class="ql-code-block"></button>
          <button class="ql-link"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-header" value="1"></button>
          <button class="ql-header" value="2"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>
          <button class="ql-indent" value="-1"></button>
          <button class="ql-indent" value="+1"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-direction" value="rtl"></button>
          <select class="ql-align"></select>
        </span>
        <span class="ql-formats">
          <button class="ql-script" value="sub"></button>
          <button class="ql-script" value="super"></button>
        </span>
        <span class="ql-formats">
          <button class="ql-clean"></button>
        </span>
      </div>
    </div>
    <!-- quill js container -->
    <div id="quilljs-container">babar</div>
    <!-- Add quill js on the project -->

    <!-- Style -->
    <!-- <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link href="https://cdn.quilljs.com/1.0.0/quill.snow.css" rel="stylesheet">-->
  </div>
</template>
<style>
/* Set dropdown font-families */

#toolbar-container .ql-font span[data-label="Sans Serif"]::before {
  font-family: "Sans Serif";
}

#toolbar-container .ql-font span[data-label="Inconsolata"]::before {
  font-family: "Inconsolata";
}

#toolbar-container .ql-font span[data-label="Roboto"]::before {
  font-family: "Roboto";
}

#toolbar-container .ql-font span[data-label="Mirza"]::before {
  font-family: "Mirza";
}

#toolbar-container .ql-font span[data-label="Arial"]::before {
  font-family: "Arial";
}
/* Set content font-families */

.ql-font-inconsolata {
  font-family: "Inconsolata";
}

.ql-font-roboto {
  font-family: "Roboto";
}

.ql-font-mirza {
  font-family: "Mirza";
}

.ql-font-arial {
  font-family: "Arial";
}
/* We do not set Sans Serif since it is the default font */
</style>


<script>
import { VueEditor, Quill } from "vue2-editor";

// Add fonts to whitelist
var Font = Quill.import("formats/font");
// We do not add Sans Serif since it is the default
Font.whitelist = ["inconsolata", "roboto", "mirza", "arial"];
Quill.register(Font, true);

export default {
  created() {
    //alert("Created");
    //We can now initialize Quill with something like this:
    var quillObj = new Quill("#quilljs-container", {
      modules: {
        toolbar: "#toolbar-container"
      },
      placeholder: "This is a font test...",
      theme: "snow"
    });
  }
};
</script>