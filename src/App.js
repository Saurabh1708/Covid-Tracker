import {useState, useEffect} from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Cases from "./components/Cases"
import Table from "./components/Table"
import SearchBar from "./components/SearchBar"
import StateList from "./components/StateList"


const stateNames={
  "AN":"Andaman and Nicobar Islands",
  "AP":"Andhra Pradesh",
  "AR":"Arunachal Pradesh",
  "AS":"Assam",
  "BR":"Bihar",
  "CH":"Chandigarh",
  "CT":"Chhattisgarh",
  "DN":"Dadra and Nagar Haveli",
  "DL":"Delhi",
  "GA":"Goa",
  "GJ":"Gujarat",
  "HR":"Haryana",
  "HP":"Himachal Pradesh",
  "JK":"Jammu and Kashmir",
  "JH":"Jharkhand",
  "KA":"Karnataka",
  "KL":"Kerala",
  "LA":"Ladakh",
  "LD":"Lakshadweep",
  "MP":"Madhya Pradesh",
  "MH":"Maharashtra",
  "MN":"Manipur",
  "ML":"Meghalaya",
  "MZ":"Mizoram",
  "NL":"Nagaland",
  "OR":"Odisha",
  "PY":"Puducherry",
  "PB":"Punjab",
  "RJ":"Rajasthan",
  "SK":"Sikkim",
  "TN":"Tamil Nadu",
  "TG":"Telangana",
  "TR":"Tripura",
  "UP":"Uttar Pradesh",
  "UT":"Uttarakhand",
  "WB":"West Bengal"
}
const list= Object.keys(stateNames).map( (s)=>{
  return stateNames[s];
})



const App= ()=>{

  const [stateData, setStateData] = useState([]);
  const [data, setData] = useState([]);
  const [districtTotalData, setDistrictTotalData] = useState([]);
  const [districtData, setDistrictData]= useState([]);
 
  const [input, setInput] = useState("");
  const [stateListDefault, setStateListDefault] = useState(list);
  const [stateList, setStateList] = useState();

  const getTotalData =  (states)=>{
    let confirmed =0, deceased=0, active= 0,recovered=0;
    //console.log(states); 
    let s;
    for(s in states){
      //console.log(s);
      confirmed+=states[s]["total"]["confirmed"];
      deceased+=states[s]["total"]["deceased"];
      recovered+=states[s]["total"]["recovered"];
    } 
    active= confirmed-recovered-deceased;
    setStateData({confirmed, deceased, active, recovered});
    setData(states);
    //console.log(states);
  }

  const getStateData = (state, currentstate) =>{
    //console.log(state);
    const confirmed=state[`${currentstate}`]["total"]["confirmed"];
    const deceased= state[`${currentstate}`]["total"]["deceased"]
    const recovered= state[`${currentstate}`]["total"]["recovered"] ;
    const active= confirmed-deceased-recovered;

    setDistrictTotalData({confirmed, recovered, active,deceased});
    setDistrictData(state[currentstate]["districts"]);
    console.log(districtData);
    
  }
  let currentURL= window.location.pathname;
  let currentstate = currentURL.split("/");
  currentstate=currentstate[currentstate.length-1];

  const time_diff= (date1) =>{
    const date2= new Date();
    date1= new Date(Date.parse(date1))
    //console.log("current time is ", date1.getTime());
    let difference = date2 - date1;

    let daysDifference = Math.floor(difference/1000/60/60/24);
    difference -= daysDifference*1000*60*60*24

    let hoursDifference = Math.floor(difference/1000/60/60);
    return hoursDifference;

  }

  const updateCache = (data)=>{
    const prevtime= new Date();
    localStorage.setItem("prevTime", prevtime);
    localStorage.setItem("myCache", JSON.stringify(data));
    console.log("Updating Cache");
  }

  const getCacheData = ()=>{
    const prevTime= localStorage.getItem("prevTime");
   // console.log( "previous time is", prevTime);
    if(prevTime === undefined){
      return "";
    }
    else{
      let diff=time_diff(prevTime);
      //console.log("diff is ",diff)
      if(diff<24){
        return JSON.parse( localStorage.getItem("myCache"));
      }
      else{
        return "";
      }
    }

  }

  const updateInput =  (input)=>{
    //console.log(stateListDefault);
    const filtered= stateListDefault.filter(s =>{
      return s.toLowerCase().includes(input.toLowerCase());
    })
    console.log("filtered", filtered);
    setInput(input);
    setStateList(filtered);
  }


  useEffect (()=>{
    const cache = getCacheData();
    //console.log("cache is", cache);
    if(cache){
      getTotalData(cache);
      if(currentstate.length >0)
          getStateData(cache, currentstate);
      console.log("Using Cache");
    }
    else{

      fetchStates()
      .then(
        (result) =>{
          getTotalData(result);
          if(currentstate.length >0)
            getStateData(result, currentstate);
          updateCache(result);
        } ,
        (error) => {
          console.log(error);
        }
      )
    }
    
    
  },[]);



  // Fetching the states
  const fetchStates= async ()=>{
    const url= "https://api.covid19india.org/v4/min/data.min.json";
    let data =await fetch(url);
    data= await data.json();
    //console.log(data);
    return data;
  }
  const statePath= `/states/${currentstate}`;
 // console.log(statePath);
 
  return (
    <Router>

        <div className="container" style= {{textAlign: "center"}}>
        <h1>Covid Tracker</h1>
        <SearchBar input ={input} handleChange={e=> updateInput(e.target.value)} />
        <StateList states= {stateList} />

        <Route path= "/" exact render= {(props) =>(
            <>
        <h2 style= {{textAlign : "left"}}>India</h2>

          <div class = "row">
          <Cases class = "column" type="Confirmed" count={stateData["confirmed"]}/>
            <Cases class = "column" type= "Active" count= {stateData["active"]} />
            <Cases class = "column" type= "Recovered" count= {stateData["recovered"]} />
            <Cases class = "column" type= "Deceased" count= {stateData["deceased"]} />
          </div> 
        <Table states= {data}/>

            </>
          )}
      />

        <Route path={statePath} render= {(props) =>(
            <>
        <h2 style= {{textAlign : "left"}}>{stateNames[currentstate]}</h2>

          <div class = "row">
            
          <Cases class = "column" type="Confirmed" count={districtTotalData["confirmed"]}/>
            <Cases class = "column" type= "Active" count= {districtTotalData["active"]} />
            <Cases class = "column" type= "Recovered" count= {districtTotalData["recovered"]} />
            <Cases class = "column" type= "Deceased" count= {districtTotalData["deceased"]} />

           
          </div>  
          <Table states= {districtData}/>
            </>
          )}
      />



        </div>
    </Router>
    
  )
}
export default App;
