function userClicked(userInfo){

    var ss = SpreadsheetApp.openByUrl(url);
    var ws = ss.getSheetByName("Data");
   
    //coloco todos dados do usúario na planilha 
    ws.appendRow(
      [
        userInfo.firstName.toUpperCase(),
        userInfo.lastName.toUpperCase(),
        userInfo.selectedApp,
        userInfo.email,
        userInfo.num_usp,
        userInfo.dep,
        new Date()
      ]
    );
    //Logger.log(name + " Clicked the button");
}
