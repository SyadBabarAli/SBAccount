<template>
  <v-card>
    <v-card-title class="grey lighten-2">Ticket Details</v-card-title>
    <v-card-text>
      <v-layout row wrap v-if="isLoadingTicketSearchDetail">
        <v-flex lg12 text-xs-center>
          <progress-circular/>
        </v-flex>
      </v-layout>

      <div v-else>
        <table>
          <tbody>
            <tr v-show="false">
              <td class="property2">IncidentDim Key</td>
              <td class="description">{{ objData.IncidentDimKey }}</td>
              <td></td>
            </tr>

            <tr>
              <td class="property2">Created Date</td>
              <td class="description">{{ objData.CreatedDate |momentDateDash }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">Status</td>
              <td class="description">{{ objData.Status }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">IR</td>
              <td class="description">{{ objData.IR }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">Support Group</td>
              <td class="description">{{ objData.SupportGroup }}</td>
              <td></td>
            </tr>

            <tr>
              <td class="property2">User Rating</td>
              <td class="description">{{ objData.Rating }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">Affected User</td>
              <td class="description">{{ objData.User }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">Created By</td>
              <td class="description">{{ objData.CreatedBy }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">Resolved By</td>
              <td class="description">{{ objData.ResolvedBy }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">Title</td>
              <td class="description">{{ objData.Title }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">Resolved Date</td>
              <td class="description">{{ objData.ResolvedDate |momentDateDash }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">Resolution Description</td>
              <td class="description">{{ objData.ResolutionDescription }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">Ftag</td>
              <td class="description">{{ objData.Ftag }}</td>
              <td></td>
            </tr>

            <tr>
              <td class="property2">Source</td>
              <td class="description">{{ objData.Source }}</td>
              <td></td>
            </tr>
            <tr>
              <td class="property2">Location</td>
              <td class="description">{{ objData.Location }}</td>
              <td></td>
            </tr>

            <tr>
              <td class="property2">Alternet Contact Method</td>
              <td class="description">{{ objData.AlternetContactMethod }}</td>
              <td></td>
            </tr>

            <tr>
              <td class="property2">Assigned To</td>
              <td class="description">{{ objData.AssignedTo }}</td>
              <td></td>
            </tr>

            <tr>
              <td class="property2">First Response Date</td>
              <td class="description">{{ objData.FirstResponseDate | momentDateDash }}</td>
              <td></td>
            </tr>

            <tr>
              <td width="50%" class="property2">Classification Category</td>
              <td width="50%" class="description">{{ objData.ClassificationCategory }}</td>
            </tr>

            <tr v-show="false">
              <td class="property2">Age</td>
              <td class="description">{{ objData.Age }}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <!-- <v-layout row wrap>

            <v-flex lg6 text-xs-left class="font-weight-bold">IncidentDimKey</v-flex>
            <v-flex lg6 text-xs-left>{{objData.IncidentDimKey}}</v-flex>

            <v-flex lg6 text-xs-left>AlternetContactMethod</v-flex>
            <v-flex lg6 text-xs-left>{{objData.AlternetContactMethod}}</v-flex>

          <v-flex lg6 text-xs-left>Ftag</v-flex>
          <v-flex lg6 text-xs-left>{{objData.Ftag}}</v-flex>

          <v-flex lg6 text-xs-left>Source</v-flex>
          <v-flex lg6 text-xs-left>{{objData.Source}}</v-flex>

          <v-flex lg6 text-xs-left>AssignedTo</v-flex>
          <v-flex lg6 text-xs-left>{{objData.AssignedTo}}</v-flex>

          <v-flex lg6 text-xs-left>CreatedBy</v-flex>
          <v-flex lg6 text-xs-left>{{objData.CreatedBy}}</v-flex>

          <v-flex lg6 text-xs-left>FirstResponseDate</v-flex>
          <v-flex lg6 text-xs-left>{{objData.FirstResponseDate | momentDateDash}}</v-flex>

          <v-flex lg6 text-xs-left>ClassificationCategory</v-flex>
          <v-flex lg6 text-xs-left>{{objData.ClassificationCategory}}</v-flex>

          <v-flex lg6 text-xs-left>Status</v-flex>
          <v-flex lg6 text-xs-left>{{objData.Status}}</v-flex>

          <v-flex lg6 text-xs-left>Rating</v-flex>
          <v-flex lg6 text-xs-left>{{objData.Rating}}</v-flex>

          <v-flex lg6 text-xs-left>CreatedDate</v-flex>
          <v-flex lg6 text-xs-left>{{objData.CreatedDate | momentDateDash}}</v-flex>

          <v-flex lg6 text-xs-left>ResolvedDate</v-flex>
          <v-flex lg6 text-xs-left>{{objData.ResolvedDate | momentDateDash}}</v-flex>

          <v-flex lg6 text-xs-left>IR</v-flex>
          <v-flex lg6 text-xs-left>{{objData.IR}}</v-flex>

          <v-flex lg6 text-xs-left>User</v-flex>
          <v-flex lg6 text-xs-left>{{objData.User}}</v-flex>

          <v-flex lg6 text-xs-left>Title</v-flex>
          <v-flex lg6 text-xs-left>{{objData.Title}}</v-flex>

          <v-flex lg6 text-xs-left>ResolutionDescription</v-flex>
          <v-flex lg6 text-xs-left>{{objData.ResolutionDescription}}</v-flex>

          <v-flex lg6 text-xs-left>SupportGroup</v-flex>
          <v-flex lg6 text-xs-left>{{objData.SupportGroup}}</v-flex>

          <v-flex lg6 text-xs-left>ResolvedBy</v-flex>
          <v-flex lg6 text-xs-left>{{objData.ResolvedBy}}</v-flex>

          <v-flex lg6 text-xs-left>Location</v-flex>
          <v-flex lg6 text-xs-left>{{objData.Location}}</v-flex>

          <v-flex lg6 text-xs-left>Age</v-flex>
          <v-flex lg6 text-xs-left>{{objData.Age}}</v-flex>
        </v-layout>
        </v-container>-->
      </div>
    </v-card-text>
    <v-divider></v-divider> 
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn flat @click="onClick">Close</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import TicketService from "../../../services/ticket-service";
import ProgressLinear from "../../../components/control/ProgressLinear";
import ProgressCircular from "../../../components/control/ProgressCircular";

export default {
  props: ["IncidentDimKey"],
  components: {
    ProgressLinear,
    ProgressCircular
  },
  data() {
    return {
      objData: {},
      isLoadingTicketSearchDetail: true
    };
  },
  watch: {
    IncidentDimKey: function() {
      this.fetchTicket();
    }
  },
  methods: {
    onClick() {
      this.$emit("Click");
    },
    fetchTicket() {
      //alert(this.IncidentDimKey);
      this.isLoadingTicketSearchDetail = true;
      if (this.IncidentDimKey != null) {
        TicketService.getTicketSerachDetail({ id: this.IncidentDimKey }).then(
          res => {
            this.objData = res.data;
            this.isLoadingTicketSearchDetail = false;
          }
        );
      }
    }
  }
};
</script>
