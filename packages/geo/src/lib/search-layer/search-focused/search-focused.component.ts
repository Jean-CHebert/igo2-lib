import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as labelListTemp from '../assets/search-layer.json';
import { IgoMap } from '../../map';
import { DataSourceService } from '../../datasource/shared/datasource.service'
import { LayerService } from '../../layer/shared/layer.service'
import { Router } from '@angular/router';
import { MapService } from '../../map/shared/map.service';
import { moveToOlFeatures } from '../../feature/shared/feature.utils';
import { FeatureLayerService } from '../services/feature-layer.service';
import { SearchLayerUiService } from '../services/search-layer-ui.service'
import { SearchLayerPrintService } from '../services/search-layer-print.service'
import { MapImageService } from "../services/map-image.service"
import { FeatureMotion } from '../../feature/shared'

@Component({
  selector: 'igo-search-focused',
  templateUrl: './search-focused.component.html',
  styleUrls: ['./search-focused.component.scss']
})
export class SearchFocusedComponent implements OnInit {

  @Input() searchResults: any;
  @Input() layerName: any;
  
  public labelList : any;
  public title: String = "Role Evaluation";

  map = new IgoMap({
    controls: {
      scaleLine: true,
      attribution: {
        collapsed: true
      }
    }
  });

  public view = {
    center: [-73, 47.2],
    zoom: 15
  };

  constructor(
    public layerService: LayerService,
    public dataSourceService: DataSourceService,
    private router: Router,
    private mapService: MapService,
    private featureLayerService: FeatureLayerService,
    private searchLayerUiService:SearchLayerUiService,
    private searchLayerPrintService:SearchLayerPrintService,
    private mapImageService:MapImageService) {

    this.dataSourceService
      .createAsyncDataSource({
        type: 'osm'
      })
      .subscribe(dataSource => {
        this.map.addLayer(
          this.layerService.createLayer({
            title: 'OSM',
            source: dataSource
          })
        );
      });
   }

  ngOnInit(): void {
    if (this.searchResults[0]){
      this.searchResults = this.searchResults[0];
    }
    this.labelList = labelListTemp[this.layerName];

    if (this.searchResults.geometry.type === "Polygon") {
      this.view.center = this.getPolygonCenter(this.searchResults.geometry)
    }
    else {
      this.view.center = this.searchResults.geometry.coordinates
    }
    this.addFeature(this.searchResults)
    this.mapImageService.setMap(this.map);

    this.searchLayerUiService.dismissLoading()
  }

  getPolygonCenter(geometry) : number[] {
    let minPointX = geometry.coordinates[0][0][0]
    let minPointY = geometry.coordinates[0][0][1]
    let maxPointX = geometry.coordinates[0][0][0]
    let maxPointY = geometry.coordinates[0][0][1]
    for (let point of geometry.coordinates[0]) {
      if (point[0] > maxPointX){
        maxPointX = point[0]
      }
      else if (point[0] < minPointX) {
        minPointX = point[0]
      }

      if (point[1] > maxPointY){
        maxPointY = point[1]
      }
      else if (point[1] < minPointY) {
        minPointY = point[1]
      }
      
    }
    return [(maxPointX+minPointX)/2, (maxPointY+minPointY)/2]
  }

  updateMap() {
    setTimeout(() => {
      this.map.ol.updateSize();
      this.view.zoom = 4;
    }, 600);
  }

  ngOnChanges() {
    this.updateMap()
  }

  addFeature(feature: any) {

    setTimeout(() => {
      this.map.overlay.clear();
      this.map.overlay.setFeatures([feature], FeatureMotion.None);
      this.map.setView({ center: [this.view.center[0], this.view.center[1]], zoom: this.view.zoom });
      this.mapImageService.setMap(this.map);
      this.updateMap();
    }, 1000);
  }

  public openRapportInMap(){
    this.router.navigate(['/igo']);
    let newFeature = this.searchResults
    if (this.searchResults.geometry.type === "Polygon"){
      newFeature.geometry.type = "Point"
      newFeature.geometry.coordinates = this.view.center
    }
    const features = this.featureLayerService.geojsonToFeature([newFeature]);
    this.featureLayerService.addFeaturesOnNewClusterMapLayer(features, this.layerName.toLowerCase(), this.layerName);
    moveToOlFeatures(this.mapService.getMap(), features);
    this.searchLayerUiService.dissmissModals()
  }

  public async exportToPDF(){
    await this.searchLayerUiService.showLoading()
    this.searchLayerPrintService.exportRoleResultToPdf(this.searchResults['properties'], this.searchResults.geometry.coordinates, this.mapImageService.getMap()).then(
      () => {
        this.searchLayerUiService.dismissLoading();
      },
      () => {
        this.searchLayerUiService.dismissLoading();
      }
    );
  }

  public formatKey(key : string){
    if(this.searchResults['properties'][key]){
      return this.labelList['databaseToScreen'][key] + " : " + this.searchResults['properties'][key]
    }
    return this.labelList['databaseToScreen'][key] + " : Valeur absente"
  }

  public lastPage(){
    this.searchLayerUiService.closeModal()
  }

  public hideSearch(){
    this.searchLayerUiService.dissmissModals();
  }

}
