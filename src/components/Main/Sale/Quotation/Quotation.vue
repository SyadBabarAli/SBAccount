<template>
  <div>
    <v-toolbar
    color="purple"
    dark
  >
    <v-toolbar-title>SB Account</v-toolbar-title>

    <v-divider
      class="mx-4"
      vertical
    ></v-divider>

    <span class="subheading">Home</span>

    <v-spacer></v-spacer>

    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn text>
        News
      </v-btn>

      <v-divider vertical></v-divider>

      <v-btn text>
        Info
      </v-btn>

      <v-divider vertical></v-divider>

      <v-btn text>
        More
      </v-btn>
      
      <v-divider vertical></v-divider>
    </v-toolbar-items>
  </v-toolbar>
    <v-row>
      <v-col class="col-3">
        <v-text-field label="Name Of Product"></v-text-field>
      </v-col>
      <v-col class="col-3">
        <v-combobox
          v-model="select"
          :items="items"
          label="Name Of City"
          multiple
        ></v-combobox>
      </v-col>
      <v-col class="col-3">
        <v-text-field label="Reference"></v-text-field>
      </v-col>
      <v-col class="col-3">
        <v-text-field label="Branches"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-4">
        <v-text-field label="More Information About Product"></v-text-field>
      </v-col>
      <v-col class="col-4">
        <v-combobox
          v-model="select"
          :items="items"
          label="Model Year"
          multiple
        ></v-combobox>
      </v-col>
      <v-col class="col-4">
        <v-combobox label="Price Range"></v-combobox>
      </v-col>
    </v-row>
  </div>
</template>