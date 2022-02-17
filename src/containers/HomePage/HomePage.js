import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import "./Homepage.scss";
import Select from "react-select";
import * as actions from "../../store/actions";
import { getHomelistingDetail } from "../../services/userService";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCities: [],
      selectedOption: "",
      // price: "",
      // address: "",
      // description: "",
      // phoneNumber: "",
      // image: "",
      searchedData: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllCities();
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        object.label = item.city;
        object.value = item.id;

        result.push(object);
      });
    }

    return result;
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allCities !== this.props.allCities) {
      let dataSelect = this.buildDataInputSelect(this.props.allCities);
      this.setState({
        allCities: dataSelect,
      });
    }
  }

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });

    let res = await getHomelistingDetail(selectedOption.value);
    if (res && res.errCode === 0 && res.data) {
      this.setState({
        searchedData: res.data,
      });
    } else {
      this.setState({
        searchedData: [],
      });
    }
  };

  render() {
    console.log("check state", this.state);
    let { searchedData } = this.state;

    return (
      <>
        <HomeHeader />
        <div className="homepage-container">
          <div className="home-header-banner">
            <div className="title1">LOOKING FOR NEW HOME?</div>
            <div className="title2">
              Thousands of apartments, houses, and condos for sale across
              Ontario
            </div>
            <div className="col-6 search-select">
              <Select
                value={this.state.selectedOption}
                onChange={this.handleChangeSelect}
                options={this.state.allCities}
              />
            </div>
            {searchedData &&
              searchedData.length > 0 &&
              searchedData.map((item, index) => {
                return (
                  <div className="search-homelisting">
                    <div className="search-top">
                      <div className="search-address">
                        Address: {item.address}, {item.cityId}
                      </div>
                      <div className="search-price">Price: {item.price}</div>
                    </div>
                    <div className="search-detail">Detail</div>
                  </div>
                );
              })}

            {/* <div
                className="search-image"
                style={{
                  backgroundImage: `url(${this.state.previewImgUrl})`,
                }}
              ></div>
              <div className="search-price"></div>
              <div className="search-address"></div>
              <div className="search-description"></div>
              <div className="search-phoneNumber"></div> */}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allCities: state.admin.allCities,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllCities: () => dispatch(actions.fetchAllCities()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
