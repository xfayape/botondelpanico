import { Component } from '@angular/core';

import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  
  logs: string[] = [];

  constructor(
    private backgroundGeolocation: BackgroundGeolocation
  ) {}

  start(){

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 1,
      distanceFilter: 1,
      debug: true,
      stopOnTerminate: false,
      // Android only section
      locationProvider: 1,
      startForeground: true,
      interval: 6000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
    };
  
    console.log('start');
  
    this.backgroundGeolocation
    .configure(config)
    .subscribe((location: BackgroundGeolocationResponse) => {
      console.log(location);
      this.logs.push(`${location.latitude},${location.longitude}`);
    });
  
    // start recording location
    this.backgroundGeolocation.start();
  
  }
  
  startBackgroundGeolocation(){
    this.backgroundGeolocation.isLocationEnabled()
    .then((rta) =>{
      if(rta){
        this.start();
      }else {
        this.backgroundGeolocation.showLocationSettings();
      }
    })
  }
  
  stopBackgroundGeolocation(){
    this.backgroundGeolocation.stop();
  }
  
}
