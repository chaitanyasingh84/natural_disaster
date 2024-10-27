
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, push, ref, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";
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
  set(ref(db, name), {
    Latitude: lat,
    Longitude: long,
    Commodities: {},
  })
  .then(()=>{
    alert("Deployer Station Added Successfully");
  })
  .catch((error) =>{
    alert("An error has occurred!");
    console.log(error); 
  })
  
}

function addCommodityToStation(deployerStation, commodityType, commodityQuantity){
  var commoditiesReference = ref(db, deployerStation + '/Commodities');
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



  /*
  else{
    push(commodityList, commodityType)
  .then(()=>{
    alert("Commodity Added Successfully");
  })
  .catch((error) =>{
    alert("An error has occurred!");
    console.log(error);
  })

  }*/
  function addNewCommodity(commodityType){
    //Check if the commodity already exists. 
    
    
    $("div").on("click", function() {
      console.log("commodasdasdity")
    })
    var ref = ref(db, 'CommodityTypes');
    
    ref.once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        $scope.foo[childKey] = childData;
      });
    });
    // commodityList.on('value', (snapshot) => {
    //   snapshot.forEach((child) => {
    //     console.log(child.key); // "child1", "child2"
    //     console.log(child.child("data").val()); // "123", "123"
    //   })});
    // var commodityList = ref(db, 'CommodityTypes');
    // var commodityExists = false;
    // console.log(commodityList)
    // commodityList.once('value').then(snapshot =>{
    //   if(snapshot.exists()){
    //     console.log('Element Exists!');
    //   }
    //   else{
    //     console.log('DNE');
    //   }
    // })
}

function commodityExists(data){
  let commodityTypes = data.val();
  let keys = Object.keys(commodityTypes);

  for(let i = 0; i < keys.length; i++){
    let infoData = keys[i].val();

  }

}
function deleteDatabaseStation(deployerStation){}

//function edit Commodity

window.addDatabaseStation = addDatabaseStation
window.addCommodityToStation = addCommodityToStation
window.addNewCommodity = addNewCommodity

