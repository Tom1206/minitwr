function addLocation(){
  var lat = 0;
  var long = 0;
  function getPos(position)
  {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    form.latitude.value = lat;
    form.longitude.value = long;

    $.noty.defaults.killer = true;
      noty({
        text: 'Congratulations ! Your location has been successfully loaded !',
        layout: 'bottom',
        closeWith: ['click', 'hover'],
        type: 'success'
        });
  }
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPos);
  } else {
    form.latitude.value = "0";
    form.longitude.value = "0";
  }
}
