import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { get, getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBgoVGQmuQPqsmYDFYuS6mmDl8QQhtAkDI",
    authDomain: "newhacksreliefgrid.firebaseapp.com",
    databaseURL: "https://newhacksreliefgrid-default-rtdb.firebaseio.com",
    projectId: "newhacksreliefgrid",
    storageBucket: "newhacksreliefgrid.firebasestorage.app",
    messagingSenderId: "774372466377",
    appId: "1:774372466377:web:e49f20acba163c153db718",
    measurementId: "G-Q5H28EYXH6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

function addDatabaseStation(name, lat, long, commodities){
  var stationsReference = ref(db, 'Deployment Stations/' + name);
  set(stationsReference, {
    lat,long
  })
.then(()=>{
  alert("Deployer Station Added Successfully");
})
.catch((error) =>{
  alert("An error has occurred!");
  console.log(error);
})

  var commodityReference = ref(db, 'Deployment Stations/' + name + '/ Commodities');
  set(commodityReference, {
    food:0,
    water:0,
    clothing: 0
  });

}

function addCommodityToStation(deployerStation, commodityType, commodityQuantity){
var newCommodityReference = ref(db, 'Deployment Stations/' + deployerStation + '/Commodities' + commodityType);
set(newCommodityReference, {
  commodityType:commodityQuantity
}
)
.then(()=>{
  alert("Deployer Station Updated Successfully");
})
.catch((error) =>{
  alert("An error has occurred!");
  console.log(error);
})
}

async function addNewCommodity(commodityType){
  //Check if the commodity already exists.
  var commodityReference = ref(db, 'Commodity Types/' + commodityType);
  set(commodityReference, {
    foo:0
  })
.then(()=>{
  alert("Commodity Added Successfully");
})
.catch((error) =>{
  alert("An error has occurred!");
  console.log(error);
})
}

function deleteDatabaseStation(deployerStation){


}

async function retrieveLat(deployerStation){
var dbRef = ref(db, 'Deployment Stations/' + deployerStation + '/lat');

get(dbRef)
.then( (snapshot) => {
  if (snapshot.exists()) {
    // return snapshot.val()
    return snapshot.val(); // All child data is here
  } else {
    console.log("No data available");
  }
})
.catch((error) => {
  console.error(error);
});

return dbRef;
}

function retrieveLong(deployerStation){
var dbRef = ref(db, 'Deployment Stations/' + deployerStation + '/long');
get(dbRef)
.then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val()); // All child data is here
  } else {
    console.log("No data available");
  }
})
.catch((error) => {
  console.error(error);
});

return dbRef;
}

function retrieveCommodities(deployerStation){
const dbRef = ref(db, 'Deployment Stations/' + deployerStation + '/Commodities');
get(dbRef)
.then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val()); // All child data is here
  } else {
    console.log("No data available");
  }
})
.catch((error) => {
  console.error(error);
});

return dbRef;
}

//This does not work at the moment. 
async function retrieveAllStations(){
  var index = 0;
  var stationList = [];
  const stationListRef = ref(db, 'Deployment Stations/');

  get(stationListRef).then( async (snapshot) => {
    for(var station in snapshot.val()){
      stationList[index] = station;
      index ++;
    }
    const a = snapshot.val()
    console.log(a);
    
    for(var i = 0; i <= index; i ++){
      console.log(stationList[i]);
    }
})
return stationList;

}

//function edit Commodity
window.addDatabaseStation = addDatabaseStation
window.addCommodityToStation = addCommodityToStation
window.addNewCommodity = addNewCommodity
window.retrieveLat = retrieveLat
window.retrieveLong = retrieveLong
window.retrieveCommodities = retrieveCommodities
window.retrieveAllStations = retrieveAllStations
