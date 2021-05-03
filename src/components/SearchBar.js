const SearchBar = ({value, handleChange}) => {
const BarStyling = {width:"20rem",background:"#F2F1F9", border:"none", padding:"0.5rem"};
  return (
    <input 
     style={BarStyling}
     key="searchbar"
     placeholder={"search your state"}
     value= {value}
     onChange = {handleChange}
    />
  );
}

export default SearchBar
