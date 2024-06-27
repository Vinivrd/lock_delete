//decarations
const url = "https://docs.google.com/spreadsheets/d/1QaV4EX1lUkpWk-_P3fAjOsqvDpA_0lzdehBUnIgqxs0/edit#gid=0";
const urlSubmit = "https://docs.google.com/spreadsheets/d/1XX5M_vGdwalfXieTrjk2_oYQPzHz9pUmMmD6U0KVSYQ/edit#gid=0"
const url_displinas = "https://docs.google.com/spreadsheets/d/1M2TFPWG1Viaw_IXDrpSFR7kXL9AWAisOl7tmLi6JHek/edit#gid=0";
var Route = {};


function doGet(e){
  let tmp = HtmlService.createTemplateFromFile("html/home");

  tmp.title = "Curso Especial";
  tmp.cursos = getCourses();
  tmp.displinas = getDisciplinas("Matemática-Núcleo Geral");
  tmp.datas = takeIntervalDate();
  return  tmp.evaluate();
}






