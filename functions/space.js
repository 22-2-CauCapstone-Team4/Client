export function getDistance(latFrom, lngFrom, latTo, lngTo) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  var R = 6371;
  var dLat = deg2rad(latTo - latFrom);
  var dLon = deg2rad(lngTo - lngFrom);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(latFrom)) *
      Math.cos(deg2rad(latTo)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}
