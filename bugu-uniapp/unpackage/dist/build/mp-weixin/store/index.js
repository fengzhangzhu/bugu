"use strict";var e=require("../common/vendor.js"),t=require("./modules/messageStore.js"),r=require("./modules/socketStateStore.js"),s=e.createStore({modules:{messageStore:t.messageStore,socketStateStore:r.socketStateStore}});exports.store=s;
