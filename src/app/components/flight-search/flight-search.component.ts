import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { debounceTime, tap } from 'rxjs';
import { Flight } from '../../interfaces/flight.interface';
import { ILocation } from '../../interfaces/location.interface';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
})
export class FlightSearchComponent implements OnInit {
  from: string = '';
  fromLocation: ILocation[] = [];
  origin!: ILocation;
  fromLocationTemplate: boolean = true;

  to: string = '';
  toLocation: ILocation[] = [];
  destination!: ILocation;
  toLocationTemplate: boolean = false;

  date!: string;
  departureDateTemplate: boolean = false;

  flights!: Flight[];
  flightTemplate: boolean = false;

  booked: boolean = false;

  first: string = '';
  last: string = '';

  constructor(private flightSvc: FlightService) {}

  ngOnInit(): void {}

  handleFromLocation() {
    this.flightSvc.searchCityAndAirport<ILocation[]>(this.from, false)
      .pipe(
        debounceTime(2000),
        tap((res: any) => {
          console.log(res);
        })
      )
      .subscribe({
        next: (res: any) => {
          this.fromLocation = res.data;
        },
      });
  }

  handleOrigin(location: ILocation) {
    console.log(location);

    this.origin = location;
    this.fromLocationTemplate = false;
    this.toLocationTemplate = true;
    this.fromLocation = [];
  }

  handleToLocation() {
    this.flightSvc.searchCityAndAirport<ILocation[]>(this.to, false)
      .pipe(
        debounceTime(2000),
        tap((res: any) => {
          console.log(res);

        }),
      ).subscribe({
        next: (res: any) => {
          this.toLocation = res.data;
        }
      });
  }

  handleDestination(location: ILocation) {
    console.log(location);

    this.destination = location;
    this.toLocationTemplate = false;
    this.toLocation = [];
    this.departureDateTemplate = true;
  }

  onFindFlight() {
    if (!this.date) {
      alert('Please choose a date');
    } else {

      this.flightSvc.findFlight<Flight[]>(this.origin.iataCode, this.destination.iataCode, this.date, true)
        .pipe(
          debounceTime(2000),
          tap((res: any) => {
            console.log(res);

          }),
        ).subscribe({
          next: (res: any) => {
            this.flights = res.data;
            console.log(this.flights);
            this.departureDateTemplate = false;
            this.flightTemplate = true;
          },
          error: (error: any) => {
            console.log(error);

          }
        });
    }
  }

  onBookFlight(flight: Flight) {
    if (this.first == '' && this.last == '') {
      alert('Enter your first and last name');
      return;
    }

    const data = { flight };
    const name = {
      first: this.first,
      last: this.last,
    };
    const dataForBookingFlight = { flight, name };

    fetch('http://localhost:5000/flight-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((dataObject) => {
        console.log('Success:', dataObject.data.flightOffers);

        const data = { flight };

        console.log(data);

        fetch('http://localhost:5000/flight-booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataForBookingFlight),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);

            this.booked = true;
            this.flightTemplate = false;
            this.flights = [];
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        console.error('Error:', error);
        alert(error);
      });
  }
}
