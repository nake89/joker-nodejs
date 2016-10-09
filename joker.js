/*

Usage:

Login:
joker login
This command returns the temporary (1h) session id.

Order auth-id:
joker getkey domain.com <INSERT THE SESSION ID HERE>
This will queue the auth-id order. You will have to wait a bit.
You will get the queue ID here.

Show auth-id:
joker showkey <INSERT THE QUEUE ID HERE> <INSERT THE SESSION ID HERE>
If you do this too fast. You will not get the auth-id. Patience is key.

*/

var request = require('request');

// Enter your Joker.com login details
var username = "";
var password = "";

// login, getkey, showkey
var jcommand = process.argv[2];
var third = process.argv[3];
var fourth = process.argv[4];

if (jcommand == "login") {
  jlogin();
} else if (jcommand == "getkey") {
  if (!third || !fourth) {
      console.log("Domain or session ID not entered.");
  } else {
    var domain = third;
    var sid = fourth;
    unlockDomain();
  }
} else if (jcommand == "showkey") {
  if (!third || !fourth) {
      console.log("Queue ID or session ID not entered.");
  } else {
    var procid = third;
    var sid = fourth;
    getProc();
  }
}

function jlogin() {
  request('https://dmapi.joker.com/request/login?username='+username+'&password='+password, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var array = body.toString().split('\n');
      for (i = 0; i < array.length; i++) {
        if (array[i].indexOf("Auth-Sid: ") > -1) {
          var authsid = array[i].replace("Auth-Sid: ", "");
          console.log("Your session ID is below:");
          console.log(authsid);
          console.log("You can order the auth ID of a domain by commanding: joker getkey domain.com <INSERT THE SESSION ID HERE>");
          i = array.length;
        }
      }
      if (!authsid) {
        console.log("Unable to login and get session ID.");
      }
    }
  });
}

function unlockDomain() {
  request('https://dmapi.joker.com/request/domain-unlock?domain='+domain+'&auth-sid='+sid, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log("Unlocking domain and getting auth ID. Wait 3 seconds please.");
      setTimeout(getAuthID, 3000);
    }
  });
}

function getAuthID() {
  request('https://dmapi.joker.com/request/domain-transfer-get-auth-id?domain='+domain+'&auth-sid='+sid, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var array = response.body.toString().split('\n');
      for (i = 0; i < array.length; i++) {
        if (array[i].indexOf("Proc-ID") > -1) {
          var procid = array[i].replace("Proc-ID: ", "");
          console.log("Your queue ID is below:");
          console.log(procid);
          console.log("You view the auth ID of a domain by commanding: joker showkey <INSERT THE QUEUE ID HERE> <INSERT THE SESSION ID HERE>");
          i = array.length;
        }
      }
      if (!procid) {
        console.log("Unable to get queue ID.");
      }
    }
  });
}

function getProc() {
  request('https://dmapi.joker.com/request/result-retrieve?proc-id='+procid+'&auth-sid='+sid, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var array = response.body.toString().split('\n');
      for (i = 0; i < array.length; i++) {
        if (array[i].indexOf("The Authorization ID is:") > -1) {
          var hasProc = 1;
          console.log(array[i]);
          i = array.length;
        }
      }
      if (!hasProc) {
        console.log("Unable to get auth ID.");
      }
    }
  });
}
