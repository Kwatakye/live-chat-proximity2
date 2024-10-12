import { Injectable } from '@angular/core';
import { Geolocation } from '@nativescript/geolocation';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private currentLocation = new BehaviorSubject<{ latitude: number, longitude: number } | null>(null);
  currentLocation$ = this.currentLocation.asObservable();

  constructor() {
    this.watchLocation();
  }

  private async watchLocation() {
    try {
      const isEnabled = await Geolocation.isEnabled();
      if (!isEnabled) {
        await Geolocation.enableLocationRequest();
      }

      Geolocation.watchLocation(
        (location) => {
          this.currentLocation.next({
            latitude: location.latitude,
            longitude: location.longitude
          });
        },
        (error) => {
          console.error('Error watching location', error);
        },
        { updateDistance: 1, minimumUpdateTime: 1000 }
      );
    } catch (error) {
      console.error('Error setting up location watching', error);
    }
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}