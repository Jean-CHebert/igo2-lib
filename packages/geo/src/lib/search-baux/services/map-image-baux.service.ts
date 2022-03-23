import { Injectable } from '@angular/core';
import { IgoMap } from '../../map/shared';

@Injectable({
  providedIn: 'root'
})
export class MapImageBauxService {

  map: IgoMap;

  constructor() { }

  setMap(map: IgoMap) {
    this.map = map;
  }

  getMap() {
    return this.map;
  }
}