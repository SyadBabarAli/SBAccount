<template>
  <div>
    <v-toolbar color="blue darken-3" dark fixed app clipped-right dense>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout>
        <v-flex xs4>
          <v-tooltip v-model="showDisatisfied" left>
            <v-btn slot="activator" icon to="/Feedback">
              <v-badge color="red" left>
                <span slot="badge">145</span>
                <v-icon color="white lighten-4" style="font-size: 20px;">sentiment_very_dissatisfied</v-icon>
              </v-badge>
            </v-btn>
            <span>Disatisfied</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs4>
          <v-tooltip v-model="showPriority" left>
            <v-btn slot="activator" icon to="/Priority">
              <v-badge color="red" left>
                <span slot="badge">145</span>
                <v-icon color="white lighten-4" style="font-size: 20px;">priority_high</v-icon>
              </v-badge>
            </v-btn>
            <span>Priority</span>
          </v-tooltip>
        </v-flex>
        <v-flex xs4>
          <v-tooltip v-model="show" left>
            <v-btn slot="activator" icon to="/Pending">
              <v-badge color="red" left>
                <span slot="badge">145</span>
                <v-icon color="white lighten-4" style="font-size: 20px;">restore</v-icon>
              </v-badge>
            </v-btn>
            <span>Overdue</span>
          </v-tooltip>
        </v-flex>
      </v-layout>

      <v-layout>
        <v-flex xs12>
          <v-menu bottom left class="pull-right">
            <v-btn slot="activator" dark icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
            <v-list>
              <v-list-tile @click to="/Login">
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </v-flex>
      </v-layout>
    </v-toolbar>
  </div>
</template>