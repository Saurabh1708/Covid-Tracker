
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

const Table = ({states}) => {
    
    const items= Object.keys(states).map((s, index) => {
        const name = s;
        const cnf= states[s]["total"]["confirmed"]? states[s]["total"]["confirmed"]: 0;
        const rec= states[s]["total"]["recovered"] ? states[s]["total"]["recovered"] :0;
        const dec= states[s]["total"]["deceased"] ? states[s]["total"]["deceased"] : 0;
        const act= cnf-rec-dec;
        return {name, cnf, rec, dec, act};

    });

    return (
        <table align ="center" >
            <thead>
                <tr>
                    <th>State</th>
                    <th>Confirmed</th>
                    <th>Active</th>
                    <th>Recovered</th>
                    <th>Deceased</th>

                </tr>
            </thead>
            <tbody>
                {
                     items.map( (i, index) => {
                        return (
                         <tr key= {index}>
                           <td><a href= {`/states/${i["name"]}`}>{stateNames[i["name"]]?stateNames[i["name"]] : i["name"] }</a></td>
                           <td>{ i["cnf"]}</td>
                           <td>{ i["act"]}</td>
                           <td>{ i["rec"]}</td>
                           <td>{ i["dec"]}</td>
                         </tr>
                       )
                      }) 
                }
           
            </tbody>
                
        </table>
 
    );

}

export default Table