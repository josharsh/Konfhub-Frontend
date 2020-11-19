import React, { Component } from "react";
import Conference from "./Conference";
import { Nav, Navbar, Form, FormControl } from 'react-bootstrap';
import "./App.css";

class SearchFilter extends Component {
  state = {
    freeConf: [],
    paidConf: [],
    itemsToDisplay: [],
    itemsToUse: [],
    countries: [],
    cities: [],
    search: "",
  };

  render() {
    return (
      <div>
        <Navbar sticky="top" bg="dark" variant="dark" style={{marginBottom:"2rem", paddingRight:"4rem"}}>
        <Navbar.Brand href="#home">
        
          Konfhub-Frontend
        </Navbar.Brand>
        <form className="search-form">
          <input
            className="form-control"
            style= {{ width:"100%"}}
            type="text"
            value={this.state.search}
            onChange={this.filterOnSearch}
            placeholder="Search by name or city"
          />
        </form>
        <div className="dropdown">
          <select id="countryfilter" className ="dropbtn" onChange={this.countryFilter}>
            <option className="dropdown-content" value="any" selected="selected">
            Filter by Country
            </option>
            {this.state.countries.map((country) => {
              return <option className="dropdown-content" value={country}>{country}</option>;
            })}
          </select>
        </div>
        
        <div className="dropdown">
          <select id="cityfilter" className ="dropbtn"  onChange={this.cityFilter}>
            <option className="dropdown-content"  value="any">Filter by City</option>
            {this.state.cities.map((city) => {
              return <option className="dropdown-content" value={city}>{city}</option>;
            })}
          </select>
        </div>
       

        <div className="dropdown">
          <select id="typefilter" className ="dropbtn"  onChange={this.typeFilter}>
            <option className="dropdown-content" value="any">Free/Paid</option>
            <option className="dropdown-content" value="free">free</option>
            <option className="dropdown-content" value="paid">paid</option>
          </select>
        </div>

      </Navbar>
        
        <div className="grid">
          {this.state.itemsToDisplay.map((conf, index) => {
            return (
              <Conference
                key={index}
                type={conf.type}
                title={conf.confName}
                place={conf.venue}
                imageURL={conf.imageURL.replace("\"","")}
                startDate={conf.confStartDate}
                endDate={conf.confEndDate}
                website={conf.confUrl}
              />
            );
          })}
        </div>
      </div>
    );
  }

  filterOnSearch = (event) => {
    this.setState({ search: event.target.value });
    if (
      !event.target.value ||
      event.target.value === " " ||
      event.target.value === ""
    )
      this.setState({ itemsToDisplay: [...this.state.itemsToUse] });
    else {
      let itemsToDisplay = [];
      itemsToDisplay = this.state.itemsToUse.filter((item) =>
        item.searchTerms.toLowerCase().includes(this.state.search.toLowerCase())
      );
      this.setState({ itemsToDisplay });
    }
  };

  countryFilter = () => {
    var e = document.getElementById("countryfilter");
    var selected = e.options[e.selectedIndex].text;

    if (selected === "Choose Any")
      this.setState({ itemsToDisplay: [...this.state.itemsToUse] });
    else {
      let itemsToDisplay = [];
      itemsToDisplay = this.state.itemsToUse.filter((item) =>
        item["country"].toLowerCase().includes(selected.toLowerCase())
      );
      this.setState({ itemsToDisplay });
    }
  };

  cityFilter = () => {
    var e = document.getElementById("cityfilter");
    var selected = e.options[e.selectedIndex].text;

    if (selected === "Choose Any")
      this.setState({ itemsToDisplay: [...this.state.itemsToUse] });
    else {
      let itemsToDisplay = [];
      itemsToDisplay = this.state.itemsToUse.filter((item) =>
        item["city"].toLowerCase().includes(selected.toLowerCase())
      );
      this.setState({ itemsToDisplay });
    }
  };

  typeFilter = () => {
    var e = document.getElementById("typefilter");
    var selected = e.options[e.selectedIndex].text;

    if (selected === "Choose Any")
      this.setState({ itemsToDisplay: [...this.state.itemsToUse] });
    else {
      let itemsToDisplay = [];
      itemsToDisplay = this.state.itemsToUse.filter((item) =>
        item["type"].toLowerCase().includes(selected.toLowerCase())
      );
      this.setState({ itemsToDisplay });
    }
  };

  async componentDidMount() {
    const response = await fetch(
      "https://o136z8hk40.execute-api.us-east-1.amazonaws.com/dev/get-list-of-conferences"
    );
    const jsonResponse = await response.json();
    for(let i=0;i<jsonResponse["paid"].length;++i){
      if(jsonResponse.paid[i].imageURL.charAt(jsonResponse.paid[i].imageURL.length-1)=="\""){
        jsonResponse.paid[i].imageURL=jsonResponse.paid[i].imageURL.slice(0,-1);
      }
    }
    for(let i=0;i<jsonResponse["free"].length;++i){
      if(jsonResponse.free[i].imageURL.charAt(jsonResponse.free[i].imageURL.length-1)=="\""){
        jsonResponse.free[i].imageURL=jsonResponse.free[i].imageURL.slice(0,-1);
      }
    }
    this.setState({ freeConf: jsonResponse.free });
    this.setState({ paidConf: jsonResponse.paid });
    this.reRenderList();
  }

  onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
  };

  reRenderList() {
    var cities = [];
    var countries = [];
    var itemsToDisplay = [];
    for (var i = 0; i < this.state.freeConf.length; i++) {
      var item = this.state.freeConf[i];
      item.type = "Free";
      // if (item.imageURL.charAt(item.imageURL.length - 1) === '\\"') {
      //   item.imageURL = item.imageURL.slice(0, -1);
      // }
      itemsToDisplay.push(this.state.freeConf[i]);
      countries.push(this.state.freeConf[i]["country"].toLowerCase().trim());
      cities.push(this.state.freeConf[i]["city"].toLowerCase().trim());
    }

    for (i = 0; i < this.state.paidConf.length; i++) {
      item = this.state.paidConf[i];
      item.type = "Paid";
      itemsToDisplay.push(this.state.paidConf[i]);
      countries.push(this.state.paidConf[i]["country"].toLowerCase().trim());
      cities.push(this.state.paidConf[i]["city"].toLowerCase().trim());
    }

    countries = Array.from(new Set(countries));
    cities = Array.from(new Set(cities));

    countries.sort();
    cities.sort();
    console.log(countries);
    this.setState({ countries });
    this.setState({ cities });
    this.setState({ itemsToDisplay }, () => {
      this.setState({ itemsToUse: [...this.state.itemsToDisplay] });
    });
  }
}

export default SearchFilter;
