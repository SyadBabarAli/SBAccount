<template>
   <div class="text-center" v-if="isAllow">
       <mu-icon value="lock" :size="75"></mu-icon>
       <h4 class="glyphicon glyphicon-plus">You have no permission to view this page.</h4>
  </div>
  <div v-else>
   <mu-card>
        <div class="panel">
            <div class="panel-header grey text-center">
                SD-KPI
            </div>
            <div class="panel-body">
                <mu-card-text>
                    <mu-row gutter>
                        <mu-col desktop="100">
                            <mu-row gutter>
                                <mu-col desktop="50">
                                    <div class="box activeTicketsITPending" >
                                        <div class="box-top it-pending-bg" @click="setView('Active')" >
                                            <div class="box-top-icon pull-left">
                                                <mu-icon value="glyphicons-charts" :size="100"></mu-icon>
                                            </div>
                                            
                                            <div class="box-top-content pull-right">
                                                <div class="text text-right">
                                                    Service Desk Statistics
                                                </div>
                                                <div class="number text-right">
                                                </div>
                                            </div>
                                            <div class="clr">
                                              
                                            </div>
                                        </div>
                                        <div class="box-bottom grey">
                                            <div class="pull-right"></div>
                                            <div class="clr"><mu-raised-button label="Service Desk Statistics" primary to="sdkpi/servicedeskstatistics" ></mu-raised-button></div>
                                        </div>
                                    </div>
                                </mu-col>
                                <mu-col desktop="50">
                                    <div class="box vendorPending">
                                        <div class="box-top vendor-pending-bg" @click="setView('Vendor Pending')">
                                            <div class="box-top-icon pull-left">
                                                <mu-icon value="glyphicons-charts" :size="100"></mu-icon>
                                            </div>
                                            <div class="box-top-content pull-right">
                                                <div class="text text-right">
                                                    Attendance KPI
                                                </div>
                                                <div class="number text-right">
                                                </div>
                                            </div>
                                            <div class="clr"></div>
                                        </div>
                                        <div class="box-bottom grey">
                                            <div class="pull-right"></div>
                                            <div class="clr"><mu-raised-button label="Attendance KPI" primary to="sdkpi/attendancekpi" ></mu-raised-button></div>
                                        </div>
                                    </div>
                                </mu-col>
                            </mu-row>
                        </mu-col>
                    </mu-row>
                </mu-card-text>
            </div>
        </div>
    </mu-card>
    
    <!-- <mu-row gutter>
      <mu-col desktop="50" tablet="50" width="100" >
       <mu-raised-button label="Service Desk Statistics" primary to="sdkpi/servicedeskstatistics" ></mu-raised-button>
    </mu-col>
      <mu-col desktop="50" tablet="50" width="100" >
       <mu-raised-button label="Attendance KPI" primary to="sdkpi/attendancekpi" ></mu-raised-button>
    </mu-col>
    </mu-row> -->
  </div>
</template>

<script>
export default {
   data() { 
    return { isAllow : false };
  },
  methods: {
    setView(val) {
      // if (val == "Active") {
      //   document
      //     .getElementsByClassName("activeTicketsITPending")[0]
      //     .classList.add("shadow");
      //   //window.open("/sdkpi/attendancekpi", "_self");
      // } else if (val == "Vendor Pending") {
      //   document
      //     .getElementsByClassName("vendorPending")[0]
      //     .classList.add("shadow");
      //   document
      //     .getElementsByClassName("activeTicketsITPending")[0]
      //     .classList.remove("shadow");
      // }
    }
  }
};
</script>
<style scoped>
canvas {
  max-height: 264px !important;
  min-height: 264px !important;
}

.box .box-top,
.box .box-bottom {
  padding: 8px;
}

.box-top .box-top-content .number {
  font-size: 44px;
  font-weight: 400;
  line-height: 44px;
}

.it-pending-border {
  border: 1px solid rgb(255, 183, 77);
}

.it-pending-bg {
  background-color: rgb(255, 183, 77);
  color: #ffffff;
  cursor: pointer;
}

.vendor-pending-border {
  border: 1px solid rgb(100, 181, 246);
}

.vendor-pending-bg {
  background-color: rgb(100, 181, 246);
  color: #ffffff;
  cursor: pointer;
}

.user-pending-border {
  border: 1px solid rgb(161, 136, 127);
}

.user-pending-bg {
  background-color: rgb(161, 136, 127);
  color: #ffffff;
  cursor: pointer;
}

.total-pending-border {
  border: 1px solid #9575cd;
}

.total-pending-bg {
  background-color: #9575cd;
  color: #ffffff;
  cursor: pointer;
}

.mu-card-text {
  font-size: 12px;
}

.active {
  background-color: #bdbdbd;
}

@media (max-width: 768px) {
  .box {
    margin: 12px 0;
  }
}

@media (min-width: 768px) {
  .row-2 {
    margin-top: 12px;
  }
}
.shadow {
  box-shadow: 10px 10px grey;
}
</style>
