function GetKladrData() {
  //Наследуем контроллер от RestController
  RestController.call(this);

  this.GET = function(query) {
    var url = "http://kladr-api.ru/api.php?token=58b1e3500a69deb5498b456f&oneString=1&query="
    this.send('GET', url + query, function(data){
      console.log(data);
    });
  };

}
