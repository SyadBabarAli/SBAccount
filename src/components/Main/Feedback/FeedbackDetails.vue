<template>
  <!-- <div class="FeedbackDetails"> -->
  <v-card>
    <v-card-title class="headline grey lighten-2" primary-title>Ticket Details</v-card-title>
    <v-card-text>
      <table>
        <tbody>
          <tr v-if="isAllowSupervisorComment">
            <td>
              <strong>Supervisor Comments</strong>
            </td>
            <td>
              <v-text-field
                v-model="feedback.SuppervisorCommentAgainstFB"
                label="Supervisor Comments"
              ></v-text-field>
              <!-- <mu-text-field
                hintText="Supervisor Comments"
                v-model="feedback.SuppervisorCommentAgainstFB"
                fullWidth
                class="mb-0"
              ></mu-text-field>-->
              <v-progress-circular
                :size="50"
                :width="1"
                color="purple"
                indeterminate
                v-if="isLodingSupervisorComment"
              ></v-progress-circular>
            </td>
            <td>
              <v-btn slot="actions" @click="updateCommentsAgainstUserFeedback">Update</v-btn>
              <!-- <mu-flat-button
                label="Update"
                slot="actions"
                primary
                @click="updateCommentsAgainstUserFeedback"
              ></mu-flat-button>-->
            </td>
          </tr>
          <tr>
            <td class="property" width="30%">Feedback Date</td>
            <td class="description" width="70%">{{ feedback.Date | momentDate }}</td>
            <td></td>
          </tr>

          <tr>
            <td class="property">Incident ID</td>
            <td class="description">{{ feedback.IncidentID }}</td>
            <td></td>
          </tr>

          <tr>
            <td class="property">Affected User</td>
            <td class="description">{{ feedback.AffectedUser }} ({{ feedback.Email }})</td>
            <td></td>
          </tr>

          <tr>
            <td class="property">Department</td>
            <td class="description">{{ feedback.Department }}</td>
            <td></td>
          </tr>

          <tr>
            <td class="property">Business Unit</td>
            <td class="description">{{ feedback.BusinessUnit }}</td>
            <td></td>
          </tr>

          <tr>
            <td class="property">Location</td>
            <td class="description">{{ feedback.Location }}</td>
            <td></td>
          </tr>

          <tr>
            <td class="property">Resolved By</td>
            <td class="description">{{ feedback.ResolvedBy }} ({{ feedback.ResolvedByEmail }})</td>
            <td></td>
          </tr>

          <tr>
            <td class="property">Support Group</td>
            <td class="description">{{ feedback.SupportGroup }}</td>
            <td></td>
          </tr>

          <tr>
            <td class="property">Rating</td>
            <td class="description">{{ feedback.Rating }}</td>
            <td></td>
          </tr>

          <tr>
            <td class="property">User Remarks</td>
            <td class="description" v-if="feedback.Remarks">{{ feedback.Remarks }}</td>
            <td class="description" v-else>Remarks for this rating are not available.</td>
            <td></td>
          </tr>
          <tr>
            <td>
              <h2>Details</h2>
            </td>
          </tr>
          <!-- </tbody>
      </table>
      <h2>Details</h2>
      <table>
          <tbody>-->
          <tr>
            <td class="property" width="30%">Title</td>
            <td class="description" width="70%">{{ ticket.Title }}</td>
          </tr>

          <tr>
            <td class="property">Resolved Date</td>
            <td class="description">{{ ticket.ResolvedDate | momentDate}}</td>
          </tr>

          <tr>
            <td class="property">User Contact</td>
            <td class="description">{{ ticket.ContactMethod }}</td>
          </tr>

          <tr>
            <td class="property">Resolution Description</td>
            <td class="description">{{ ticket.ResolutionDescription }}</td>
          </tr>
        </tbody>
      </table>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <!-- <button-normal :description="'Close'" @Click="onClick"/> -->
      <v-btn flat @click="onClick">Close</v-btn>
    </v-card-actions>
  </v-card>
  <!-- </div> -->
</template>

<script>
import moment from "moment";

import axios from "axios";

import FeedbackService from "../../../services/feedback-service";
import TicketService from "../../../services/ticket-service";
//import ButtonGrid from "../../control/ButtonGrid";
//import ButtonNormal from "../../control/ButtonNormal";

export default {
  props: ["incidentId"],
  // components: {
  //   ButtonNormal
  // },
  data() {
    return {
      feedback: {},
      ticket: {},
      isLoadingFeedback: false,
      isLoadingTicket: false,
      isLodingSupervisorComment: false,
      loadingFeedbackText: "",
      loadingTicketText: "",
      isAllowSupervisorComment: false
    };
  },
  watch: {
    incidentId: function() {
      //alert(this.incidentId);
      this.fetchFeedback();
      this.fetchTicket();
      this.suppervisorComment();
    }
  },
  // created() {
  //   //this.fetchFeedback();
  //   //this.fetchTicket();
  //    this.suppervisorComment();
  // },
  methods: {
    suppervisorComment() {
      this.isAllowSupervisorComment = false;
      axios
        .get(this.$urlApplication + "GetRoleUserRuleMenu")
        .then(response => {
          var objData = response.data;
          var isTrue = false;
          for (var i = 0; i < objData.length; i++) {
            var obj = objData[i];
            var OptionName = obj.name;
            //debugger;
            if (OptionName == "Supervisor Comments (Feedback)") {
              this.isAllowSupervisorComment = true;
              break;
            }
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {});
    },
    onClick() {
      this.$emit("Click");
    },
    fetchFeedback() {
      //this.suppervisorComment();
      //alert(this.incidentId);
      this.isLoadingFeedback = true;
      this.loadingFeedbackText = "Loading feedback details...";

      if (this.incidentId != null) {
        FeedbackService.get({ incident_id: this.incidentId }).then(res => {
          this.feedback = res.data;
          this.isLoadingFeedback = false;
          this.loadingFeedbackText = "Feedback Details";
        });
      }
    },
    fetchTicket() {
      this.isLoadingTicket = true;
      this.loadingTicketText = "Loading ticket details...";
      if (this.incidentId != null) {
        TicketService.get({ id: this.incidentId }).then(res => {
          //Set For Empty Dates
          if (res.data.ResolvedDate == undefined) {
            res.data.ResolvedDate = "empty";
          }
          this.ticket = res.data;
          this.isLoadingTicket = false;
          this.loadingTicketText = "Ticket Details";
        });
      }
    },
    updateCommentsAgainstUserFeedback() {
      this.isLodingSupervisorComment = true;
      if (this.incidentId != null) {
        FeedbackService.updateCommentsAgainstUserFeedback({
          incidentID: this.incidentId,
          comment: this.feedback.SuppervisorCommentAgainstFB
        })
          .then(res => {
            this.isLodingSupervisorComment = false;
          })
          .catch(error => {
            //console.log(error)
            this.isLodingSupervisorComment = false;
            alert(error.response.data.Message);
          });
      }
    }
  }
};
</script>
