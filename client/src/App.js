import React, { Component } from 'react';
import ReactMap from 'react-mapbox-gl';
import { Layer, Feature, Marker } from "react-mapbox-gl";
import apiHelper from "./apiHelper"

const accessToken = "pk.eyJ1Ijoid3p3eiIsImEiOiJjanc0czEzMTkwcmV1NDRzMGgyMHM1anVoIn0.aLsKwuAlEmyopuZjU_1DxA";
const style = "mapbox://styles/mapbox/streets-v9";

const Map = ReactMap({
  accessToken
});

const mapStyle = {
  height: '100vh',
  width: '100vw'
};

const circleStyle = {
  'circle-radius': 15,
  'circle-color': '#00b0ff',
  'circle-opacity': 0.8
}

const centre = [-0.09703693531972489, 51.49731912307631]

class App extends Component {

  state = {
    zoomRate: [11.5],
    noDrivers: 5,
    data: [{ "driver_id": "0-5iazwdovmsg", "location": { "latitude": 51.49731912307631, "longitude": -0.09703693531972489, "bearing": 235 } }],
    smallLat: 0,
    bigLat: 0,
    smallLong: 0,
    bigLong: 0,
  };

  formatResponseArr() {
    return (
      this.state.data.map(each =>
        <Feature coordinates={[each.location.longitude, each.location.latitude]} key={each.driver_id} />)
    );
  }

  findBounds() {
    let long = this.state.data.map(e => {
      return e.location.longitude
    })
    let lat = this.state.data.map(e => {
      return e.location.latitude
    })
    long.push(centre[0])
    lat.push(centre[1])
    this.setState({ smallLat: Math.min(...lat) })
    this.setState({ smallLong: Math.min(...long) })
    this.setState({ bigLat: Math.max(...lat) })
    this.setState({ bigLong: Math.max(...long) })
  }

  getDrivers() {
    apiHelper.getDrivers(this.state.noDrivers)
      .then(res => {
        this.setState({ data: JSON.parse(res).drivers }, () => {
          this.findBounds()
        })
      })
      .catch(err => {
        console.log('err', err)
      })
  }

  onUpdate(e) {
    this.setState({
      noDrivers: e.target.value
    }, this.getDrivers)
  }

  componentDidMount() {
    this.getDrivers()
  }

  render() {
    const image = new Image(30, 30);
    image.src = './red-marker.svg';
    const images = ["myImage", image];

    return (
      <div>
        <Map
          // eslint-disable-next-line
          style={style}
          containerStyle={mapStyle}
          fitBounds={[[this.state.smallLong, this.state.smallLat], [this.state.bigLong, this.state.bigLat]]}
          fitBoundsOptions={{
            padding: 150
          }}
        >
          <div className='map-overlay top'>
            <div className='map-overlay-inner'>
              <h2>View {this.state.noDrivers} drivers in this region</h2>
              <label id='month'></label>
              <input id='slider' type='range' min='1' max='50' step='1'
                onChange={e => this.onUpdate(e)} value={this.state.noDrivers} />
            </div>
          </div>
          <Layer
            type="symbol"
            id="marker"
            layout={{ "icon-image": "myImage" }}
            images={images}
          >
            {this.formatResponseArr()}
          </Layer>

          <Layer
            type="circle"
            paint={circleStyle}
          >
            <Feature coordinates={centre} />
          </Layer>

        </Map>
      </div>
    );
  }
}

export default App;

