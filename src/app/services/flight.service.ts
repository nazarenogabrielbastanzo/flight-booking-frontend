import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private _headers!: HttpHeaders;

  constructor(private http: HttpClient) {
    this._headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  searchCityAndAirport(
    location: string,
    activateHeaders: boolean
  ): Observable<any> {
    return this.http.get<any>(
      `http://localhost:5000/city-and-airport-search/${location}`,
      activateHeaders ? { headers: this._headers } : {}
    );
  }

  findFlight(
    originCode: string,
    destinationCode: string,
    dateOfDeparture: string,
    activateHeaders: boolean
  ): Observable<any> {
    return this.http.get<any>(
      `http://localhost:5000/flight-search?originCode=${originCode}&destinationCode=${destinationCode}&dateOfDeparture=${dateOfDeparture}`,
      activateHeaders ? { headers: this._headers } : {}
    );
  }
}
