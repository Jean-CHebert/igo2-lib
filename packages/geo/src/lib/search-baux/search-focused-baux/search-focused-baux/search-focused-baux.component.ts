import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import * as labelListTemp from '../../assets/search-layer.json';
import { IgoMap } from '../../../map';
import { DataSourceService } from '../../../datasource/shared/datasource.service'
import { LayerService } from '../../../layer/shared/layer.service'
import { Router } from '@angular/router';
import { MapService } from '../../../map/shared/map.service';
import { moveToOlFeatures } from '../../../feature/shared/feature.utils';
import { FeatureLayerService } from '../../../search-role/feature-layer-service/feature-layer.service';
import { SearchBauxUiService } from '../..';
import { SearchBauxPrintService } from '../../services/search-baux-print.service';
import { MapImageBauxService } from '../../services/map-image-baux.service';
import { FeatureMotion } from '../../../feature/shared'

@Component({
  selector: 'igo-search-focused-baux',
  templateUrl: './search-focused-baux.component.html',
  styleUrls: ['./search-focused-baux.component.scss']
})
export class SearchFocusedBauxComponent implements OnInit {

  @Input() searchResults: any;
  @Input() client: any;
  
  public labelList : any;
  public title: String = "Baux";
  private loading: HTMLIonLoadingElement;
  public BauxResults : any;

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
    private searchBauxUiService:SearchBauxUiService,
    private searchBauxPrintService:SearchBauxPrintService,
    private mapImageBauxService:MapImageBauxService,
    private loadingController: LoadingController) {

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
      this.BauxResults = this.searchResults[0];
    }
    else{
      this.BauxResults = this.searchResults;
    }
    this.labelList = labelListTemp;
    this.view.center = this.BauxResults.geometry.coordinates
    this.addFeature(this.BauxResults)
    this.mapImageBauxService.setMap(this.map);
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
      this.map.overlay.setFeatures([feature], FeatureMotion.Default);
      this.map.setView({ center: this.BauxResults.geometry.coordinates, zoom: this.view.zoom });
      this.mapImageBauxService.setMap(this.map);
      this.updateMap();
    }, 1000);
  }

  public openRapportInMap(){
    this.router.navigate(['/igo']);
    const features = this.featureLayerService.geojsonToFeature([this.BauxResults]);
    this.featureLayerService.addFeaturesOnNewClusterMapLayer(features, 'baux', 'Baux');
    moveToOlFeatures(this.mapService.getMap(), features);
    this.searchBauxUiService.dissmissModals()
  }

  public async exportToPDF(){
    /*await this.showLoading()
    this.searchBauxPrintService.exportBauxResultToPdf(this.BauxResults['properties'], this.BauxResults.geometry.coordinates, this.mapImageService.getMap()).then(
      () => {
        this.dismissLoading();
      },
      () => {
        this.dismissLoading();
      }
    );*/
  }

  public formatKey(key : string){
    if(this.BauxResults['properties'][key]){
      return this.labelList['databaseToScreen'][key] + " : " + this.BauxResults['properties'][key]
    }
    return this.labelList['databaseToScreen'][key] + " : Valeur absente"
  }

  public lastPage(){
    this.searchBauxUiService.closeModal()
  }

  public hideSearch(){
    this.searchBauxUiService.dissmissModals();
  }

  private async showLoading() {
    this.loading = await this.loadingController.create({
      message: 'Recherche en cours, veuillez patienter svp...'
    });
    await this.loading.present();
  }

  private dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
}
