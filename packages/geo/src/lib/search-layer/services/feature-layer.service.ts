import { Injectable } from '@angular/core';
import { MapService } from '../../map/shared/map.service';
import { QueryableDataSourceOptions } from '../../query/shared/query.interfaces';
import { VectorLayer } from '../../layer/shared/layers/vector-layer';
import { ClusterDataSourceOptions } from '../../datasource/shared/datasources/cluster-datasource.interface';
import { ClusterDataSource } from '../../datasource/shared/datasources/cluster-datasource';
import { Feature } from '../../feature/shared/feature.interfaces';
import { FEATURE } from '../../feature/shared/feature.enums';
import { featureToOl } from '../../feature/shared/feature.utils';
import { StyleService } from '../../layer/shared/style.service';

import { ClusterParam } from '../../layer';
import { ClusterRange } from '../../layer';

@Injectable({
  providedIn: 'root'
})
export class FeatureLayerService {

  constructor(
    private mapService: MapService,
    private styleService: StyleService
  ) { }


  geojsonToFeature(geogson: any[]) {
    const features: Feature[] = new Array();

    for (let i = 0; i < geogson.length; i++) {
      const feature: Feature = {
        type: FEATURE,
        projection: 'EPSG:4326',
        properties: geogson[i].properties,
        geometry: {
          type: 'Point',
          coordinates: geogson[i].geometry.coordinates
        },
        meta: {
          id: i,
          title: `Résultat ${i}`
        }
      };
      const olFeature = featureToOl(feature, this.mapService.getMap().projection);
      features.push(olFeature);
    }
    return features;
  }

  public addFeaturesOnNewClusterMapLayer(features: Feature[], layerId: string, layerName: string) {
    const baseStyle = {
      circle: {
        fill: {
          color: 'green'
        },
        stroke: {
          color: 'black'
        },
        radius: 4
      }
    };

    const layerStyle = {
      circle: {
        fill: {
          color: 'red'
        },
        stroke: {
          color: 'black'
        },
        radius: 4
      }
    };
    const clusterRange: ClusterRange = {
      minRadius: 1,
      maxRadius: 1,
      style: baseStyle
    };

    const resultsLayer = this.mapService.getMap().getLayerById(layerId);
    if (resultsLayer !== undefined) {
      this.mapService.getMap().removeLayer(resultsLayer);
    }
    const clusterParam: ClusterParam = {
      clusterRanges: [clusterRange]
    };
    const sourceOptions: ClusterDataSourceOptions & QueryableDataSourceOptions = {
      distance: 40,
      queryable: true,
      type: 'cluster'
    };
    const featureSource = new ClusterDataSource(sourceOptions);
    featureSource.ol.source.addFeatures(features);
    const style = feature => {
      return this.styleService.createClusterStyle(feature, clusterParam, layerStyle);
    };

    const date = new Date();
    const today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    const layer = new VectorLayer({
      title: `Résultats ${layerName} ${today} ${time}`,
      source: featureSource,
      id: layerId,
      style: style
    });
    this.mapService.getMap().addLayer(layer);
  }
}
