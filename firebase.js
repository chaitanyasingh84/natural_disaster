
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, push, ref , get , child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
const firebaseConfig = {
  apiKey: "AIzaSyACx61Met7FUTN9yIK-YhNzQLl6iI-Lzx0",
  authDomain: "newhacksnaturaldisaster.firebaseapp.com",
  databaseURL: "https://newhacksnaturaldisaster-default-rtdb.firebaseio.com",
  projectId: "newhacksnaturaldisaster",
  storageBucket: "newhacksnaturaldisaster.appspot.com",
  messagingSenderId: "226374042268",
  appId: "1:226374042268:web:b31f9507d25b406ca6a359",
  measurementId: "G-S3F6ZSW91M"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

function addDatabaseStation(name, lat, long, commodities){
    var stationsReference = ref(db, 'Deployment Stations/');
  stationsReference.child("name").setValue(name)

  // var stationsReference = ref(db, 'Deployment Stations/');
  // stationsReference.child(name).setValue(
  //   lat
  // )
  /*
  
  stationsReference.child("name").setValue()
  push(stationsReference, {
    StationName: name,
    Properties:{
        Latitude: lat,
        Longitude: long,
    }
  })
    */
  .then(()=>{
    alert("Deployer Station Added Successfully");
  })
  .catch((error) =>{
    alert("An error has occurred!");
    console.log(error); 
  })
  
}

function addCommodityToStation(deployerStation, commodityType, commodityQuantity){
  var commoditiesReference = ref(db, 'Deployment Stations/' + deployerStation + '/Commodities');
  push(commoditiesReference, {
      type: commodityType,
      quantity: commodityQuantity
  })
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
    const dbRef = ref(db, 'CommodityTypes');

    push(dbRef, commodityType)
    .then(()=>{
      alert("Commodity Added Successfully");
    })
    .catch((error) =>{
      alert("An error has occurred!");
      console.log(error);
    })

  }

  async function readDeploymentStation(commodityType){
    //Check if the commodity already exists. 
    const dbRef = ref(db, 'Deployment Stations/');
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
    });}


function deleteDatabaseStation(deployerStation){}

//function edit Commodity

window.addDatabaseStation = addDatabaseStation
window.addCommodityToStation = addCommodityToStation
window.addNewCommodity = addNewCommodity

