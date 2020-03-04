<template>
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>Ticket Details</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <table>
        <tbody>
          <tr>
            <td class="property">CreatedDate</td>
            <td class="description">{{ ticket.CreatedDate | momentDateDash }}</td>
          </tr>

          <tr>
            <td class="property">ID</td>
            <td class="description">{{ ticket.Id }}</td>
          </tr>

          <tr>
            <td class="property">AffectedUser</td>
            <td class="description">{{ ticket.AffectedUser }}</td>
          </tr>

          <tr>
            <td class="property">Title</td>
            <td class="description">{{ ticket.Title }}</td>
          </tr>

          <tr>
            <td class="property">Description</td>
            <td class="description">{{ ticket.Description }}</td>
          </tr>

          <tr>
            <td class="property">ContactMethod</td>
            <td class="description">{{ ticket.ContactMethod }}</td>
          </tr>

          <tr>
            <td class="property">FTag</td>
            <td class="description">{{ ticket.FTag }}</td>
          </tr>

          <tr>
            <td class="property">SupportGroup</td>
            <td class="description">{{ ticket.SupportGroup }}</td>
          </tr>

          <tr>
            <td class="property">FirstResponseDate</td>
            <td class="description">{{ ticket.FirstResponseDate | momentDateDash }}</td>
          </tr>

          <tr>
            <td class="property">EscalatedDate</td>
            <td class="description">{{ ticket.EscalatedDate | momentDateDash }}</td>
          </tr>

          <tr>
            <td class="property">Status</td>
            <td class="description">{{ ticket.Status }}</td>
          </tr>

          <tr>
            <td class="property">ResolvedDate</td>
            <td class="description">{{ ticket.ResolvedDate | momentDateDash }}</td>
          </tr>

          <tr>
            <td class="property">ResolvedBy</td>
            <td class="description">{{ ticket.ResolvedBy }}</td>
          </tr>

          <tr>
            <td class="property">ResolutionDescription</td>
            <td class="description">{{ ticket.ResolutionDescription }}</td>
          </tr>

          <tr>
            <td class="property">CreatedBy</td>
            <td class="description">{{ ticket.CreatedBy }}</td>
          </tr>

          <tr>
            <td class="property">Source</td>
            <td class="description">{{ ticket.Source }}</td>
          </tr>
        </tbody>
      </table>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="onClick">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import moment from "moment";
import TicketService from "../../services/ticket-service";

export default {
  props: ["getTicketId"],
  data() {
    return {
      ticket: {},
      isLoadingTicket: false,
      loadingTicketText: ""
    };
  },
  watch: {
    getTicketId: function() {
      this.fetchTicket();
    }
  },
  methods: {
    onClick() {
      this.$emit("Click");
    },
    async fetchTicket() {
      this.isLoadingTicket = true;
      //this.loadingTicketText = "Loading ticket details...";
      const res = await TicketService.getTicketDetails(this.getTicketId);
      this.ticket = res.data;
      this.isLoadingTicket = false;
      //this.loadingTicketText = "Ticket Details";
    }
  }
};
</script>