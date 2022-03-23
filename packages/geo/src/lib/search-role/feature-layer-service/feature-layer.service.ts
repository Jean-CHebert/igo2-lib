import { Injectable } from '@angular/core';
//import { MapService, FeatureDataSourceOptions, QueryableDataSourceOptions, FeatureDataSource, VectorLayer, Layer, ClusterDataSourceOptions, ClusterDataSource, Feature, 
//  FEATURE, featureToOl, StyleService } from "@igo2/geo";
import { MapService } from '../../map';
import { FeatureDataSourceOptions } from '../../datasource';
import { QueryableDataSourceOptions } from '../../query';
import { FeatureDataSource } from '../../datasource';
import { VectorLayer } from '../../layer';
import { Layer } from '../../layer';
import { ClusterDataSourceOptions } from '../../datasource';
import { ClusterDataSource } from '../../datasource';
import { Feature } from '../../feature';
import { FEATURE } from '../../feature';
import { featureToOl } from '../../feature';
import { StyleService } from '../../layer';

import { ClusterParam } from '../../layer';
import { ClusterRange } from '../../layer';
//import { ClusterParam, ClusterRange } from '@igo2/geo/lib/layer/shared/clusterParam';


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

  public addFeaturesOnNewMapLayer(features: Feature[], layerId: string, layerName: string) {
    const baseStyle = {
      circle: {
        fill: {
          color: 'red'
        },
        stroke: {
          color: 'black'
        },
        radius: 4,
      }
    };

    const style = this.styleService.createStyle(baseStyle);
    const sourceOptions: FeatureDataSourceOptions & QueryableDataSourceOptions = {
      queryable: true,
      type: 'vector'
    };
    const featureSource = new FeatureDataSource(sourceOptions);
    featureSource.ol.addFeatures(features);
    featureSource.ol.projection_ = 'EPSG:4326';
    const resultsLayer = this.mapService.getMap().getLayerById(layerId);
    if (resultsLayer !== undefined) {
      this.mapService.getMap().removeLayer(resultsLayer);
    }


    const date = new Date();
    const today = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
    const time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    const layer = new VectorLayer({
      title: `Résultats ${layerName} ${today} ${time}`,
      source: featureSource,
      sourceOptions: sourceOptions,
      id: layerId,
      style: style,
    });
    this.mapService.getMap().addLayer(layer);
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
