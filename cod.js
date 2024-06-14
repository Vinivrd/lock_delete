//decarations
var url = "https://docs.google.com/spreadsheets/d/12gRuEgIVOPZhCpM8qFeGmLmJd-aPeBBgxP6iNRwZr38/edit#gid=1304623703";
var Route = {};

Route.path =  (route,callback) => {
  Route[route] = callback;
}

function doGet(e){
  Route.path("form",loadForm);

  if(Route[e.parameters.v]) {
    return Route[e.parameters.v]();
  }else{
    return HtmlService.createTemplateFromFile("html/home").evaluate();
  }
}

function loadForm(){
  
  let tmp = HtmlService.createTemplateFromFile("html/home");
  tmp.title = "Curso Especial";

 
  return  tmp.evaluate();
}






