<template>
  <v-content>
    <v-parallax
      src="https://blog-images-bucket.s3.amazonaws.com/media/private/carlos-muza-84523_u62x84y.jpg"
      height="700"
      width="700"
      jumbotron
    >
      <v-container grid-list-xl>
        <v-layout row justify-center>
          <v-flex lg3>
            <v-card class="rounded-card">
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="headline">Login</span>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-card-title>
                <div>
                  <v-form ref="form" v-model="valid" lazy-validation>
                    <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
                    <v-text-field
                      v-model="password"
                      :append-icon="show1 ? 'visibility_off' : 'visibility'"
                      :rules="[rules.required, rules.min]"
                      :type="show1 ? 'text' : 'password'"
                      name="input-10-1"
                      label="Password"
                      hint="At least 8 characters"
                      counter
                      @click:append="show1 = !show1"
                    ></v-text-field>
                    <!-- <v-checkbox v-model="checkbox" label="Remember Me"></v-checkbox>
                <v-btn :disabled="!valid" @click="submit">Login</v-btn>
                    <v-btn @click="clear">clear</v-btn>-->
                  </v-form>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="orange" :disabled="!valid" @click="submit">Login</v-btn>
                <v-btn flat color="orange" :disabled="!valid" @click="submit">clear</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-parallax>
  </v-content>
</template>
<script>
import axios from "axios";
import Vue from "vue";
import router from "../../router";

export default {
  data: () => ({
    valid: true,
    name: "",
    email: "syedbabarali@gmail.com",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ],
    checkbox: false,

    show1: false,
    show2: true,
    show3: false,
    show4: false,
    password: "Password",
    rules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 8 || "Min 8 characters",
      emailMatch: () => "The email and password you entered don't match"
    }
  }),
  created: function() {},
  methods: {
    submit() {
      // Send a POST request
      var reqData = {
        username: "admin",
        password: "admin123",
        grant_type: "password"
      };
      var objD = Object.keys(reqData)
        .map(function(key) {
          return (
            encodeURIComponent(key) + "=" + encodeURIComponent(reqData[key])
          );
        })
        .join("&");
      axios({
        method: "post",
        url: "http://localhost:60868/token",
        withCredentials: true,
        crossdomain: true,
        data: objD,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Cache-Control": "no-cache"
        }
      })
        .then(function(response) {
          var token = response.data.access_token;

          localStorage.setItem("token", token);
          axios.defaults.headers.common["Authorization"] = token;
          console.log("access_token :" + token);

          router.push("dashboard");
        })
        .catch(function(error) {
          console.log("Post Error : " + error);
        });
    },
    getTicketResolver() {
      var token = axios.defaults.headers.common["Authorization"];

      var config = {
        headers: { Authorization: "bearer " + token }
      };
      axios
        .get("http://localhost:60868/api/general/GetRequestType", config)
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    clear() {
      this.$refs.form.reset();
    }
  }
};
</script>