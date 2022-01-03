import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {

  from: any = "";


  constructor() { }

  ngOnInit(): void {
  }  
    
    
  onSubmit() {
    console.log("form submitted");
    
  }

  handleFromLocation() {
    
  }

}
