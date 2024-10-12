import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocationService } from './location.service';

interface User {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users = new BehaviorSubject<User[]>([]);
  users$ = this.users.asObservable();

  constructor(private locationService: LocationService) {
    // Simulate other users for testing
    this.simulateUsers();
  }

  private simulateUsers() {
    this.locationService.currentLocation$.subscribe(location => {
      if (location) {
        const simulatedUsers: User[] = [
          { id: '1', name: 'Alice', latitude: location.latitude + 0.001, longitude: location.longitude + 0.001 },
          { id: '2', name: 'Bob', latitude: location.latitude - 0.001, longitude: location.longitude - 0.001 },
          { id: '3', name: 'Charlie', latitude: location.latitude + 0.002, longitude: location.longitude - 0.002 },
        ];
        this.users.next(simulatedUsers);
      }
    });
  }

  getNearbyUsers(maxDistance: number): User[] {
    const currentLocation = this.locationService.currentLocation$.getValue();
    if (!currentLocation) return [];

    return this.users.getValue().filter(user => {
      const distance = this.locationService.calculateDistance(
        currentLocation.latitude, currentLocation.longitude,
        user.latitude, user.longitude
      );
      return distance <= maxDistance;
    });
  }
}