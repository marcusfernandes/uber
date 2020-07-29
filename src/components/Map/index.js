import React, {useEffect, useState, useRef} from 'react';
import {View, PermissionsAndroid, Image} from 'react-native';

import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import MapView, {Marker} from 'react-native-maps';

import {
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
  Back,
} from './styles';

import {getPixelSize} from '../../utils';

import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';

import makerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

Geocoder.init('AIzaSyDQOfXSwBRXK7TG_UskxmgSZEWyHK4KWJE');

const Map = () => {
  const [position, setPosition] = useState(null);
  const [destionation, setDestionation] = useState(null);
  const [duration, setDuration] = useState(null);
  const [location, setLocation] = useState(null);
  const mapView = useRef(null);

  function handleLocationSelected(data, {geometry}) {
    const {
      location: {lat: latitude, lng: longitude},
    } = geometry;

    setDestionation({
      latitude,
      longitude,
      title: data.structured_formatting.main_text,
    });
  }

  function handleback() {
    setDestionation(null);
  }

  useEffect(() => {
    async function loadLocation() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permissão para acessar sua localização',
            message:
              'Uber Precisa de sua permissão para acessar sua localização',
            buttonNeutral: 'Pergunte depois',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancelar',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Geolocation.getCurrentPosition(
            async ({coords: {latitude, longitude}}) => {
              const response = await Geocoder.from({latitude, longitude});
              const address = response.results[0].formatted_address;
              const location = address.substring(0, address.indexOf(','));
              setLocation(location);
              setPosition({
                latitude,
                longitude,
                latitudeDelta: 0.0143,
                longitudeDelta: 0.0134,
              });
            },
            () => {},
            {
              timeout: 2000,
              maximumAge: 1000,
              enableHighAccuracy: true,
            },
          );
        }
      } catch (error) {}
    }
    loadLocation();
  }, []);

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        initialRegion={position}
        showsUserLocation
        loadingEnabled
        ref={mapView}>
        {destionation && (
          <>
            <Directions
              origin={position}
              destination={destionation}
              onReady={(result) => {
                setDuration(Math.floor(result.duration));
                mapView.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    top: getPixelSize(50),
                    bottom: getPixelSize(350),
                  },
                });
              }}
            />
            <Marker coordinate={destionation} image={makerImage}>
              <LocationBox>
                <LocationText>{destionation.title}</LocationText>
              </LocationBox>
            </Marker>

            <Marker coordinate={position}>
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>
          </>
        )}
      </MapView>
      {destionation ? (
        <>
          <Back onPress={handleback}>
            <Image source={backImage} />
          </Back>
          <Details />
        </>
      ) : (
        <Search onLocationSelected={handleLocationSelected} />
      )}
    </View>
  );
};

export default Map;
