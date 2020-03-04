<template>
  <layout-one :title="'Call Monitoring Score Card'">
    <v-card-title>
      <v-toolbar-title>Details</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <!-- {{this.editedItem.Courtesy}} -->
      <v-spacer></v-spacer>
      <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>

      <v-dialog
        v-model="dialogMainPage"
        max-width="500px"
        scrollable
        persistent
        fullscreen
        hide-overlay
      >
        <v-btn v-show="rights.Modify" slot="activator" color="primary" dark class="mb-2">Add</v-btn>
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="close">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                v-if="rights.Modify"
                flat
                @click="post"
                v-show="this.editedIndex === -1 ? true : false"
              >save</v-btn>

              <v-btn
                v-if="rights.Modify"
                flat
                @click="put"
                v-show="this.editedIndex === -1 ? false : true"
              >update</v-btn>

              <v-btn flat @click="clear" v-if="rights.Modify">clear</v-btn>

              <v-btn dark flat @click="close">cancel</v-btn>
            </v-toolbar-items>
          </v-toolbar>

          <v-card-text>
            <v-container fluid text-xs-center>
              <v-layout row wrap>
                <v-flex xs6 text-xs-center>
                  <v-card text-xs-center>
                    <month-picker />
                  </v-card>
                </v-flex>

                <v-flex xs6 text-xs-center>
                  <v-card text-xs-center>
                    <v-combobox
                      v-model="selectRoleUserId"
                      :items="itemsRoleUserId"
                      label="Select an agent"
                      item-text="text"
                      item-value="value"
                    ></v-combobox>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-card color="#D9E1F2">
                    <v-card-text class="px-0 font-weight-bold">Call Quality Monitoring Scorecard</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs6>
                  <v-card color="#D9E1F2">
                    <v-card-text class="px-0 font-weight-bold">Agent Name (Console ID)</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-card color="#9BC2E6">
                    <v-card-text class="px-0 font-weight-bold">Criteria</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#9BC2E6">
                    <v-card-text class="px-0 font-weight-bold">Weight Rate (1 to 5)</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#9BC2E6">
                    <v-card-text class="px-0 font-weight-bold">Rating</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#9BC2E6">
                    <v-card-text class="px-0 font-weight-bold">Score</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-flex xs12>
                    <v-card color="#DDEBF7">
                      <v-card-text class="px-0 text-xs-left font-weight-bold">GREETING SKILLS</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Used appropriate greeting</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Department Introduction</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Self-Introduction</v-card-text>
                    </v-card>
                  </v-flex>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text class="px-0 font-weight-bold">{{WeightGreetingSkill}}%</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card
                    v-bind:style="{  'background-color': this.editedItem.GreetingSkill==1 || this.editedItem.GreetingSkill==2 ? '#ff8f8f' : this.editedItem.GreetingSkill== 3 ? '#ffe699' :'#a9d08e' }"
                  >
                    <v-card-text class="px-0 font-weight-bold">
                      <input v-model="this.editedItem.GreetingSkill" class="text-xs-center" />
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{convertTwoDecimal((WeightGreetingSkill /100) * this.editedItem.GreetingSkill) }}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-flex xs12>
                    <v-card color="#DDEBF7">
                      <v-card-text
                        class="px-0 text-xs-left font-weight-bold"
                      >CUSTOMER IDENTITY VERIFICATION</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text
                        class="px-0 text-xs-left"
                      >Obtained and/or verifies customer information</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text
                        class="px-0 text-xs-left"
                      >Get the necessary details to confirm the caller’s identity, such as their user id, employee number, title and department.</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text
                        class="px-0 text-xs-left"
                      >Take proper actions, if the identification is not verified.</v-card-text>
                    </v-card>
                  </v-flex>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{WeightCustomerIdentityVerification}}%</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#FFE699">
                    <v-card
                      v-bind:style="{  'background-color': this.editedItem.CustomerIdentityVerification==1 ||this.editedItem.CustomerIdentityVerification==2 ? '#ff8f8f' : this.editedItem.CustomerIdentityVerification== 3 ? '#ffe699' :'#a9d08e' }"
                    >
                      <v-card-text class="px-0 font-weight-bold">
                        <input
                          v-model="this.editedItem.CustomerIdentityVerification"
                          class="text-xs-center"
                        />
                      </v-card-text>
                    </v-card>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{convertTwoDecimal((WeightCustomerIdentityVerification /100) * this.editedItem.CustomerIdentityVerification )}}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-flex xs12>
                    <v-card color="#DDEBF7">
                      <v-card-text class="px-0 text-xs-left font-weight-bold">CUSTOMER NAME</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text
                        class="px-0 text-xs-left"
                      >Used the customer's name at least once during the call</v-card-text>
                    </v-card>
                  </v-flex>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text class="px-0 font-weight-bold">{{WeightCustomerName}}%</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card
                    v-bind:style="{  'background-color': this.editedItem.CustomerName==1 || this.editedItem.CustomerName==2 ? '#ff8f8f' : this.editedItem.CustomerName== 3 ? '#ffe699' :'#a9d08e' }"
                  >
                    <v-card-text class="px-0 font-weight-bold">
                      <input v-model="this.editedItem.CustomerName" class="text-xs-center" />
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{convertTwoDecimal((WeightCustomerName /100) * this.editedItem.CustomerName) }}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-flex xs12>
                    <v-card color="#DDEBF7">
                      <v-card-text class="px-0 text-xs-left font-weight-bold">LISTENING SKILLS</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Avoided repetition</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Avoided wrong interpretation</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Clarified customer issue</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Does not interrupt the customer</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Easily understood</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text
                        class="px-0 text-xs-left"
                      >Exhibited responsiveness toward the customer</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Focused on the call</v-card-text>
                    </v-card>
                  </v-flex>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text class="px-0 font-weight-bold">{{WeightListenSkills}}%</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card
                    v-bind:style="{  'background-color': this.editedItem.ListenSkills==1 || this.editedItem.ListenSkills== 2 ? '#ff8f8f' :  this.editedItem.ListenSkills== 3 ? '#ffe699' :'#a9d08e' }"
                  >
                    <v-card-text class="px-0 font-weight-bold">
                      <input v-model="this.editedItem.ListenSkills" class="text-xs-center" />
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{convertTwoDecimal((WeightListenSkills /100) * this.editedItem.ListenSkills) }}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-flex xs12>
                    <v-card color="#DDEBF7">
                      <v-card-text class="px-0 text-xs-left font-weight-bold">SPEAKING SKILLS</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Accent did not affect understanding</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Accurate word and sounded pronunciation</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Avoided errors</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Spoke clearly and audibly</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Talked at length</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Talked without pauses or hesitations</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Talked without self-corrections</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Used a range of word & paraphrasing</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Used intonation</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Used perceivable vocabularies</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Used polite/appropriate tone</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text
                        class="px-0 text-xs-left"
                      >Uses Proper grammar, appropriate terms and expressions</v-card-text>
                    </v-card>
                  </v-flex>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text class="px-0 font-weight-bold">{{WeightSpeakingSkills}}%</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card
                    v-bind:style="{  'background-color': this.editedItem.SpeakingSkills==1 || this.editedItem.SpeakingSkills== 2 ? '#ff8f8f' :  this.editedItem.SpeakingSkills== 3 ? '#ffe699' :'#a9d08e' }"
                  >
                    <v-card-text class="px-0 font-weight-bold">
                      <input v-model="this.editedItem.SpeakingSkills" class="text-xs-center" />
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{convertTwoDecimal((WeightSpeakingSkills /100) * this.editedItem.SpeakingSkills) }}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-flex xs12>
                    <v-card color="#DDEBF7">
                      <v-card-text
                        class="px-0 text-xs-left font-weight-bold"
                      >ASSESSMENT AND ISSUE SOLVING SKILLS</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Resolved issue or gives alternatives</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Confirmed satisfaction</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Used effective and tactful probing</v-card-text>
                    </v-card>
                  </v-flex>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{WeightAssesmentAndIssuSolvingSkills}}%</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card
                    v-bind:style="{  'background-color': this.editedItem.AssesmentAndIssuSolvingSkills==1 || this.editedItem.AssesmentAndIssuSolvingSkills== 2 ? '#ff8f8f' :  this.editedItem.AssesmentAndIssuSolvingSkills== 3 ? '#ffe699' :'#a9d08e' }"
                  >
                    <v-card-text class="px-0 font-weight-bold">
                      <input
                        v-model="this.editedItem.AssesmentAndIssuSolvingSkills"
                        class="text-xs-center"
                      />
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{convertTwoDecimal((WeightAssesmentAndIssuSolvingSkills /100) * this.editedItem.AssesmentAndIssuSolvingSkills) }}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-flex xs12>
                    <v-card color="#DDEBF7">
                      <v-card-text class="px-0 text-xs-left font-weight-bold">CALL HANDLING SKILLS</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Portray a positive department image</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Prevents or overcomes resistance</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text
                        class="px-0 text-xs-left"
                      >Takes ownership / expresses willingness to help</v-card-text>
                    </v-card>
                  </v-flex>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text class="px-0 font-weight-bold">{{WeightCallHandlingSkills}}%</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card
                    v-bind:style="{  'background-color': this.editedItem.CallHandlingSkills==1 || this.editedItem.CallHandlingSkills== 2 ? '#ff8f8f' :  this.editedItem.CallHandlingSkills== 3 ? '#ffe699' :'#a9d08e' }"
                  >
                    <v-card-text class="px-0 font-weight-bold">
                      <input v-model="this.editedItem.CallHandlingSkills" class="text-xs-center" />
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{convertTwoDecimal((WeightCallHandlingSkills /100) * this.editedItem.CallHandlingSkills )}}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-flex xs12>
                    <v-card color="#DDEBF7">
                      <v-card-text class="px-0 text-xs-left font-weight-bold">COURTESY</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text
                        class="px-0 text-xs-left"
                      >Apologized when appropriate (business mistakes)</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Showed empathy when appropriate</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text
                        class="px-0 text-xs-left"
                      >Showed interest and willingness to assist the customer</v-card-text>
                    </v-card>
                  </v-flex>

                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Used "please" when appropriate</v-card-text>
                    </v-card>
                  </v-flex>

                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Used "thank you" when appropriate</v-card-text>
                    </v-card>
                  </v-flex>

                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Does Not use profanity</v-card-text>
                    </v-card>
                  </v-flex>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text class="px-0 font-weight-bold">{{WeightCourtesy}}%</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card
                    v-bind:style="{  'background-color': this.editedItem.Courtesy==1 || this.editedItem.Courtesy== 2 ? '#ff8f8f' :  this.editedItem.Courtesy== 3 ? '#ffe699' :'#a9d08e' }"
                  >
                    <v-card-text class="px-0 font-weight-bold">
                      <input v-model="this.editedItem.Courtesy" class="text-xs-center" />
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{convertTwoDecimal((WeightCourtesy /100) * this.editedItem.Courtesy )}}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-flex xs12>
                    <v-card color="#DDEBF7">
                      <v-card-text class="px-0 text-xs-left font-weight-bold">USING HOLD</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text
                        class="px-0 text-xs-left"
                      >Informed the customer before placing them on hold</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Kept in touch during long hold</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Thanked the customer for holding</v-card-text>
                    </v-card>
                  </v-flex>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text class="px-0 font-weight-bold">{{WeightUsingHold}}%</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card
                    v-bind:style="{  'background-color': this.editedItem.UsingHold==1 || this.editedItem.UsingHold== 2 ? '#ff8f8f' :  this.editedItem.UsingHold== 3 ? '#ffe699' :'#a9d08e' }"
                  >
                    <v-card-text class="px-0 font-weight-bold">
                      <input v-model="this.editedItem.UsingHold" class="text-xs-center" />
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{convertTwoDecimal((WeightUsingHold /100) * this.editedItem.UsingHold)}}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs6>
                  <v-flex xs12>
                    <v-card color="#DDEBF7">
                      <v-card-text class="px-0 text-xs-left font-weight-bold">CLOSING SKILLS</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Provided ticket number</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Summarized the call</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex xs12>
                    <v-card>
                      <v-card-text class="px-0 text-xs-left">Used appropriate closing</v-card-text>
                    </v-card>
                  </v-flex>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text class="px-0 font-weight-bold">{{WeightClosingSkills}}%</v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card
                    v-bind:style="{  'background-color': this.editedItem.ClosingSkills==1 || this.editedItem.ClosingSkills== 2 ? '#ff8f8f' : this.editedItem.ClosingSkills== 3 ? '#ffe699' :'#a9d08e' }"
                  >
                    <v-card-text class="px-0 font-weight-bold">
                      <input v-model="this.editedItem.ClosingSkills" class="text-xs-center" />
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex xs2>
                  <v-card color="#DDEBF7">
                    <v-card-text
                      class="px-0 font-weight-bold"
                    >{{convertTwoDecimal((WeightClosingSkills /100) * this.editedItem.ClosingSkills) }}</v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="filterd"
      class="elevation-3 mytable"
      :search="search"
      :pagination.sync="pagination"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.CallQualityMonitoringScorecardID }}</td>
        <td class="text-xs-left">{{ props.item.CreatedDate }}</td>
        <td class="text-xs-left">{{ props.item.GreetingSkill }}</td>
        <td class="text-xs-left">{{ props.item.CustomerIdentityVerification }}</td>
        <td class="text-xs-left">{{ props.item.CustomerName }}</td>
        <td class="text-xs-left">{{ props.item.ListeningSkill }}</td>
        <td class="text-xs-left">{{ props.item.SpeakingSkill }}</td>
        <td class="text-xs-left">{{ props.item.AssessmentAndIssueSolvingSkill }}</td>
        <td class="text-xs-left">{{ props.item.CallHandlingSkill }}</td>
        <td class="text-xs-left">{{ props.item.Courtesy }}</td>
        <td class="text-xs-left">{{ props.item.UsingHold }}</td>
        <td class="text-xs-left">{{ props.item.ClosingSkill }}</td>
        <td class="text-xs-left">{{ props.item.RequestTypeId }}</td>
        <td class="text-xs-left">{{ props.item.RoleUserIdFK }}</td>
        <td class="justify-center layout px-0">
          <v-btn
            color="primary"
            fab
            small
            dark
            style="height:22px;width:22px;font-size:13px;"
            v-if="rights.Modify"
          >
            <v-icon style="font-size:13px" @click="editItem(props.item)">edit</v-icon>
          </v-btn>
          <v-btn
            color="red"
            fab
            small
            dark
            style="height:22px;width:22px;font-size:13px;"
            v-if="rights.Delete"
          >
            <v-icon style="font-size:13px" @click="deleteItem(props.item)">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </layout-one>
</template>
<script>
import { mixins } from "../../../mixins/CustomMixins";

import DatePickerFrom from "../../../components/control/DatePickerFrom";
import DatePickerTo from "../../../components/control/DatePickerTo";
import DialogLoader from "../../../components/control/DialogLoader";
import MonthPicker from "../../../components/control/MonthPicker";
import LayoutOne from "../../../components/control/layout/LayoutOne";
import store from "../../../store";
import axios from "axios";

export default {
  mixins: [mixins],
  components: {
    DialogLoader,
    DatePickerFrom,
    DatePickerTo,
    MonthPicker,
    LayoutOne
  },
  data() {
    return {
      listOfRecord: [],
      editedItem: {
        CallQualityMonitoringScorecardID: 0,
        CreatedDate: 0,
        GreetingSkill: 0,
        CustomerIdentityVerification: 0,
        CustomerName: 0,
        ListeningSkill: 0,
        SpeakingSkill: 0,
        AssessmentAndIssueSolvingSkill: 0,
        CallHandlingSkill: 0,
        Courtesy: 0,
        UsingHold: 0,
        ClosingSkill: 0,
        RequestTypeId: 0,
        RoleUserIdFK: 0,
        IsDeleted: 0,
        CreatedBy: 0,
        Created: 0,
        ModifiedBy: 0,
        Modified: 0
      },
      defaultItem: {
        CallQualityMonitoringScorecardID: 0,
        CreatedDate: 0,
        GreetingSkill: 0,
        CustomerIdentityVerification: 0,
        CustomerName: 0,
        ListeningSkill: 0,
        SpeakingSkill: 0,
        AssessmentAndIssueSolvingSkill: 0,
        CallHandlingSkill: 0,
        Courtesy: 0,
        UsingHold: 0,
        ClosingSkill: 0,
        RequestTypeId: 0,
        RoleUserIdFK: 0,
        IsDeleted: 0,
        CreatedBy: 0,
        Created: 0,
        ModifiedBy: 0,
        Modified: 0
      },

      pagination: {
        descending: true,
        sortBy: "CallQualityMonitoringScorecardID",
        rowsPerPage: 5
      },
      search: "",
      headers: [
        {
          text: "ID",
          value: "CallQualityMonitoringScorecardID"
        },
        { text: "Created Date", value: "CreatedDate" },
        { text: "Greeting Skill", value: "GreetingSkill" },
        {
          text: "Customer Identity Ver",
          value: "Customer Identity Ver"
        },
        { text: "Customer Name", value: "CustomerName" },
        { text: "Listening Skill", value: "ListeningSkill" },
        { text: "Speaking Skill", value: "SpeakingSkill" },
        {
          text: "Assessment AndIssue Solving Skill",
          value: "Assessment AndIssue Solving Skill"
        },
        { text: "Call Handling Skill", value: "CallHandlingSkill" },
        { text: "Courtesy", value: "Courtesy" },
        { text: "Using Hold", value: "UsingHold" },
        { text: "Closing Skill", value: "ClosingSkill" },
        { text: "Request Type Id", value: "RequestTypeId" },
        { text: "RoleUser Id FK", value: "RoleUserIdFK" },
        {
          text: "Actions",
          value: "",
          sortable: false,
          align: "center",
          class: ""
        }
      ],

      rights: {
        View: true,
        Modify: true,
        Delete: true,
        Class: "csmHide"
      },
      editedIndex: -1,
      dialogMainPage: false,
      selectRoleUserId: null,
      itemsRoleUserId: [],
      WeightGreetingSkill: 5,
      WeightCustomerIdentityVerification: 10,
      WeightCustomerName: 3,
      WeightListenSkills: 10,
      WeightSpeakingSkills: 30,
      WeightAssesmentAndIssuSolvingSkills: 20,
      WeightCallHandlingSkills: 5,
      WeightCourtesy: 6,
      WeightUsingHold: 6,
      WeightClosingSkills: 5,
      //
      // RatingGreetingSkill: 5,
      // RatingCustomerIdentityVerification: 3,
      // RatingCustomerName: 1,
      // RatingListenSkills: 3,
      // RatingSpeakingSkills: 2,
      // RatingAssesmentAndIssuSolvingSkills: 3,
      // RatingCallHandlingSkills: 3,
      // RatingCourtesy: 4,
      // RatingUsingHold: 4,
      // RatingClosingSkills: 4,
      //
      ScoreGreetingSkill: 0,
      ScoreCustomerIdentityVerification: 0,
      ScoreCustomerName: 1,
      ScoreListenSkills: 3,
      ScoreSpeakingSkills: 2,
      ScoreAssesmentAndIssuSolvingSkills: 0,
      ScoreCallHandlingSkills: 0,
      ScoreCourtesy: 0,
      ScoreUsingHold: 0,
      ScoreClosingSkills: 0,
      emailAddress: "syedbabar.ali@aku.edu",
      snackbar: {
        isTrue: false
      }
    };
  },
  created: function() {
    store.commit("setCurrentScreenName", "CrystalReportEmail");

    this.getUserRights([906, 907, 908]).then(result => {
      result.forEach(element => {
        //debugger
        if (element.name == "View") {
          this.rights.View = true;
        }

        if (element.name == "Modify") {
          this.rights.Modify = true;
        }

        if (element.name == "Delete") {
          this.rights.Delete = true;
        }
      });
    });

    this.tableLoad();
    this.getRoleUsersAgents();
  },
  computed: {
    filterd() {
      var result = null;
      result = this.listOfRecord;
      return result;
    },

    IsSnackBar() {
      return this.snackbar.isTrue;
    },
    formTitle() {
      return this.editedIndex === -1
        ? "New Mass Notification"
        : "Edit Mass Notification";
    }
  },
  methods: {
    post() {
      var obj = this.editedItem;
      obj.CallQualityMonitoringScorecardID = this.CallQualityMonitoringScorecardID;
      obj.CreatedDate = this.CreatedDate;
      obj.GreetingSkill = this.GreetingSkill;
      obj.CustomerIdentityVerification = this.CustomerIdentityVerification;
      obj.CustomerName = this.CustomerName;
      obj.ListeningSkill = this.ListeningSkill;
      obj.SpeakingSkill = this.SpeakingSkill;
      obj.AssessmentAndIssueSolvingSkill = this.AssessmentAndIssueSolvingSkill;
      obj.CallHandlingSkill = this.CallHandlingSkill;
      obj.Courtesy = this.Courtesy;
      obj.UsingHold = this.UsingHold;
      obj.ClosingSkill = this.ClosingSkill;
      obj.RequestTypeId = this.RequestTypeId;
      obj.RoleUserIdFK = this.RoleUserIdFK;

      axios({
        method: "post",
        url: this.$urlApplication + "Post",
        data: obj
      })
        .then(res => {
          this.tableLoad();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {
          alert(error.response.data);
        });
    },
    put() {
      var obj = this.editedItem;
      obj.CallQualityMonitoringScorecardID = this.CallQualityMonitoringScorecardID;
      obj.CreatedDate = this.CreatedDate;
      obj.GreetingSkill = this.GreetingSkill;
      obj.CustomerIdentityVerification = this.CustomerIdentityVerification;
      obj.CustomerName = this.CustomerName;
      obj.ListeningSkill = this.ListeningSkill;
      obj.SpeakingSkill = this.SpeakingSkill;
      obj.AssessmentAndIssueSolvingSkill = this.AssessmentAndIssueSolvingSkill;
      obj.CallHandlingSkill = this.CallHandlingSkill;
      obj.Courtesy = this.Courtesy;
      obj.UsingHold = this.UsingHold;
      obj.ClosingSkill = this.ClosingSkill;
      obj.RequestTypeId = this.RequestTypeId;
      obj.RoleUserIdFK = this.RoleUserIdFK;

      //Update
      axios({
        method: "put",
        url:
          this.$urlApplication +
          "Put?id=" +
          obj.CallQualityMonitoringScorecardID,
        data: obj
      })
        .then(res => {
          this.tableLoad();
          this.close();
          this.snackbar.isTrue = !this.snackbar.isTrue;
        })
        .catch(error => {
          alert(error.response.data);
        });
    },

    delete(id) {
      var pId = id;
      axios({
        method: "delete",
        url: this.$urlApplication + "Delete?id=" + pId
      })
        .then(res => {
          this.tableLoad();
        })
        .catch(error => {});
    },

    async tableLoad() {
      axios({
        method: "get",
        url: this.$urlApplication + "CallQualityMonitoringScoreCard/Get"
      })
        .then(res => {
          this.listOfRecord = res.data;
        })
        .catch(error => {});
    },
    getRoleUsersAgents() {
      axios({
        method: "get",
        url: this.$urlApplication + "general/GetRoleUserBySupportGroup?id=85"
      })
        .then(res => {
          this.itemsRoleUserId = [];
          for (let value of res.data) {
            var result = {
              value: value.value,
              text: value.text
            };
            this.itemsRoleUserId.push(result);
          }
        })
        .catch(error => {});
    },
    clear() {
      this.editedItem.CallQualityMonitoringScorecardID = 0;
      this.editedItem.CreatedDate = 0;
      this.editedItem.GreetingSkill = 0;
      this.editedItem.CustomerIdentityVerification = 0;
      this.editedItem.CustomerName = 0;
      this.editedItem.ListeningSkill = 0;
      this.editedItem.SpeakingSkill = 0;
      this.editedItem.AssessmentAndIssueSolvingSkill = 0;
      this.editedItem.CallHandlingSkill = 0;
      this.editedItem.Courtesy = 0;
      this.editedItem.UsingHold = 0;
      this.editedItem.ClosingSkill = 0;
      this.editedItem.RequestTypeId = 0;
      this.editedItem.RoleUserIdFK = 0;
    },
    close() {
      if (!this.dialogMainPage) {
        this.clear();
      }
      this.dialogMainPage = false;
      setTimeout(() => {
        //this.editedItem = Object.assign({}, this.defaultItem);
        //this.editedIndex = -1;
      }, 300);
    }
  }
};
</script>
<style scoped>
.rat1,
rat2 {
  color: #ff8f8f;
}
.rat3 {
  color: #ffe699;
}
.rat4,
rat5 {
  color: #a9d08e;
}
.v-card__text {
  padding: 0px;
  width: 100%;
}
</style>