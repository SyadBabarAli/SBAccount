import axios from 'axios'

var urlDomain ="https://localhost:44345/" 

//Live
//var urlDomain = "https://sddashboard.aku.edu";

var httpHost = urlDomain+"api/"; 

import Vue from "vue";
Vue.prototype.$urlApplication = httpHost; 
Vue.prototype.$urlDomain = urlDomain;   

export const feedback = () => {
    return axios.create({
        baseURL: httpHost + '/feedbacks'
    })
}
export const ticket = () => { 
    return axios.create({
        baseURL: httpHost + 'tickets' 
    })
}
export const callstatustics = () => {
    return axios.create({
        baseURL: httpHost + 'callstatustics'
    })
}
export const application = () => {
    return axios.create({
        baseURL: httpHost + 'application'
    })
}
export const application2 = () => {
    return axios.create({
        baseURL: httpHost + 'application'
    })
}