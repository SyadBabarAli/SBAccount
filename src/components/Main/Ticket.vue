<template>
  <div id="ticket">
    <v-card-title>
      <v-toolbar-title>Tickets</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
      <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">Add</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <form>
                <v-layout wrap class id="divTicketId">
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.TicketId" label="TicketId" disabled></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout wrap class id="divDateMonth">
                  <v-flex lg12>
                    <month-picker/>
                    <v-text-field v-model="editedItem.DateMonth" label="DateMonth"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout wrap class id="divRemarks">
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.Remarks" label="Remarks"></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout wrap class id="divIR">
                  <v-flex lg12>
                    <v-text-field v-model="editedItem.IR" label="IR"></v-text-field>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              flat
              @click="postTicket"
              v-bind:class="[this.editedIndex === -1 ? '' : 'csmHide']"
            >save</v-btn>
            <v-btn
              flat
              @click="putTicket"
              v-bind:class="[this.editedIndex === -1 ? 'csmHide' : '']"
            >update</v-btn>
            <v-btn flat @click="clear">clear</v-btn>
            <v-btn flat @click="close">cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-data-table :headers="headers" :items="desserts" class="elevation-3" :search="search">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.TicketId }}</td>
        <td class="text-xs-left">{{ props.item.DateMonth }}</td>
        <td class="text-xs-left">{{ props.item.Remarks }}</td>
        <td class="text-xs-left">{{ props.item.IR }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mixins } from "../../mixins/CustomMixins";
import Application from "../../services/application-service";
import MonthPicker from "../../components/control/MonthPicker";
import axios from "axios";
export default {
  mixins: [mixins],
  components: {
    MonthPicker
  },
  data: () => ({
    dialog: false,
    search: "",
    headers: [
      { text: "TicketId", value: "TicketId" },
      { text: "DateMonth", value: "DateMonth" },
      { text: "Remarks", value: "Remarks" },
      { text: "IR", value: "IR" },
      { text: "Actions", value: "", sortable: false }
    ],
    isLoading: true,
    isValidate: true,
    desserts: [],
    editedIndex: -1,
    editedItem: {
      TicketId: "",
      DateMonth: "",
      Remarks: "",
      IR: ""
    },
    defaultItem: {
      TicketId: "0",
      DateMonth: "01-Jan-2019",
      Remarks: "Test 123",
      IR: "IR323"
    }
  }),
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "New Ticket" : "Edit Ticket";
    }
  },
  watch: {
    dialog(val) {
      var isTrue = val;
      isTrue || this.close();
    }
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.getTicket();
    },
    async getTicket() {
      const res = await Application.getTickets()
        .then(res => {
          this.desserts = res.data;
        })
        .catch(error => {});
    },
    postTicket() {
      var obj = this.editedItem;
      debugger;
      obj.TicketId = 0;
      axios({
        method: "post",
        url: this.$urlApplication + "PostTicket",
        data: obj
      })
        .then(res => {
          this.getTicket();
          this.close();
        })
        .catch(error => {});
    },

    putTicket() {
      var obj = this.editedItem;
      axios({
        method: "put",
        url: this.$urlApplication + "PutTicket?id=" + obj.TicketId,
        data: obj
      })
        .then(res => {
          this.getTicket();
          this.close();
        })
        .catch(error => {});
    },

    deleteTicket(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "DeleteTicket?id=" + pId
      })
        .then(res => {
          this.getTicket();
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.TicketId = "";
      this.editedItem.DateMonth = "";
      this.editedItem.Remarks = "";
      this.editedItem.IR = "";
    },
    editItem(item) {
      var obj = item;
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.desserts.indexOf(item);

      confirm("Are you sure you want to delete this item?") &&
        //this.desserts.splice(index, 1);
        this.deleteTicket(item.TicketId);
    },
    close() {
      if (!this.dialog) {
        this.clear();
      }
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  }
};
</script>
<style>
.csmHide {
  display: none;
}
</style>