import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
 
  private clientReady= new BehaviorSubject(false);

  constructor() {
    
  }
}
