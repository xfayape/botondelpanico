import { Component } from '@angular/core';

import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  
  logs: string[] = [];
  pastCoords : any = [];

  constructor(
    private backgroundGeolocation: BackgroundGeolocation,
    private storage: Storage
  ) {
      
        
  }

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
    try {
      this.storage.ready().then(
        () => {
      this.storage.get('formerCoords')
    .then(
        (data) =>  {
          this.pastCoords = data;
          for (let i = 0 ; i < this.pastCoords.length; i++) {
            this.logs.push(`${this.pastCoords[i].lat},${this.pastCoords[i].lon}` )
          }
        },
        error => this.pastCoords = []
      );
    });
    }
    catch(e) {
      console.log(e);
    }
    
    
    
    
    console.log('start');
  
    this.backgroundGeolocation
    .configure(config)
    .subscribe((location: BackgroundGeolocationResponse) => {
      console.log(location);
      this.logs.push(`${location.latitude},${location.longitude}`);
      this.pastCoords.push({ lat : location.latitude, lon : location.longitude});
      if (this.pastCoords.length > 10) {
        this.pastCoords.shift();
      }
      this.storage.ready().then(
        () => {
          this.storage.set('formerCoords', this.pastCoords);
          console.log('Grabado');
        }
      );

      }
    );
  
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
