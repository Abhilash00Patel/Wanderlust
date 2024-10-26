console.log(mapToken)
console.log(coordinates)
mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: "map",
  center: coordinates,
  zoom: 9,
});


const marker = new mapboxgl.Marker({
  color: "red"
})
.setLngLat(coordinates)
.setPopup(new mapboxgl.Popup({offset:20, closeOnMove: true})
.setHTML(`<h4>${locate}</h4><p>Exact location will be provided after booking!</p>`))
.addTo(map);

