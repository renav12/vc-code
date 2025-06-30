const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {},
    layers: []
  },
  center: [51, 0],
  zoom: 1,
});

map.on('load', () => {
  // Фон
  map.addLayer({
    id: 'background',
    type: 'background',
    paint: {
      'background-color': 'lightblue'
    }
  });

  // Базовый слой OpenStreetMap
  map.addSource('osm-tiles', {
    type: 'raster',
    tiles: [
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
    ],
    tileSize: 256,
    attribution: '© OpenStreetMap contributors'
  });

  map.addLayer({
    id: 'osm-layer',
    type: 'raster',
    source: 'osm-tiles'
  });

  // Источник и слой стран
  map.addSource('countries', {
    type: 'geojson',
    data: './data/countries.geojson',
    attribution: 'Natural Earth'
  });

  map.addLayer({
    id: 'countries-layer',
    type: 'fill',
    source: 'countries',
    paint: {
      'fill-color': ['match', ['get', 'MAPCOLOR7'], 1, 'red', 'darkgray'],
      'fill-opacity': 0.7
    }
  });

  // Источник и слой рек
  map.addSource('rivers', {
    type: 'geojson',
    data: './data/rivers.geojson'
  });

  map.addLayer({
    id: 'rivers-layer',
    type: 'line',
    source: 'rivers',
    paint: {
      'line-color': '#00BFFF',
      'line-width': 2
    }
  });

  // Источник и слой озёр
  map.addSource('lakes', {
    type: 'geojson',
    data: './data/lakes.geojson'
  });

  map.addLayer({
    id: 'lakes-layer',
    type: 'fill',
    source: 'lakes',
    paint: {
      'fill-color': 'lightblue',
      'fill-outline-color': '#00BFFF'
    }
  });

  // Источник и слой городов
  map.addSource('cities', {
    type: 'geojson',
    data: './data/cities.geojson'
  });

  map.addLayer({
    id: 'cities-layer',
    type: 'circle',
    source: 'cities',
    paint: {
      'circle-color': 'rgb(234, 112, 12)',
      'circle-radius': 6,
      'circle-stroke-color': 'white',
      'circle-stroke-width': 1
    },
    filter: ['>', ['get', 'POP_MAX'], 1000000]
  });

  // Интерактивность: изменение курсора
  map.on('mouseenter', 'cities-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'cities-layer', () => {
    map.getCanvas().style.cursor = '';
  });

  // Попап при клике на город
  map.on('click', 'cities-layer', (e) => {
    if (!e.features.length) return;

    new maplibregl.Popup()
      .setLngLat(e.features[0].geometry.coordinates)
      .setHTML(e.features[0].properties.NAME)
      .addTo(map);
  });
});
