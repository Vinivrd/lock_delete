
function getCourses(){
   let ss = SpreadsheetApp.openByUrl(url);
   let ws = ss.getSheetByName("Cursos");
   let list = ws.getRange(1,1,ws.getRange("A1").getDataRegion().getLastRow(),1).getValues();
   return list.map(value => value[0]);
}

function getDisplinas (curso){
  let curso_name;
  let lista;
  
  switch (curso) {
    case "Bacharelado em Ciência de Dados":
      curso_name = "BCD";
      lista = get_displinas_date(curso_name);
      break;
    case "Bacharelado em Matemática":
      curso_name = "BMA";
      lista = get_displinas_date(curso_name);
      break;
    case "Matemática- Núcleo Geral":
      curso_name = "MATNG";
      lista = get_displinas_date(curso_name);
      break;
    case "Licenciatura em Matemática":
      curso_name = "LMA";
      lista = get_displinas_date(curso_name);
      break;
    case "Bacharelado em Estatística e Ciência de Dados":
      curso_name = "BECD";
      lista = get_displinas_date(curso_name);
      break;
    case "Bacharelado em Sistema de Informação":
      curso_name = "BSI";
      lista = get_displinas_date(curso_name);
      break;
    case "Bacharelado em Ciências de Computação":
      curso_name = "BCC";
      lista = get_displinas_date(curso_name);
      break;
    case "Bacharelado em Matemática Aplicada e Computação Científica":
      curso_name = "BMACC";
      lista = get_displinas_date(curso_name);
      break;
    default:
      break;
  }
  return lista;
}

function get_displinas_date(curso){
  let ss = SpreadsheetApp.openByUrl(url_displinas);
  let ws = ss.getSheetByName(curso);
  let range = ws.getRange(1, 1, ws.getLastRow(), ws.getLastColumn()).getValues();

  let result = range.map(row => {
    return [row[1], row[2], row[3]]; // Corrigindo a forma como o array é criado
  });
  
  // Remove o cabeçalho se existir
  result.shift();
  return result;
}

function sendEmailWithAlias(userInfo) {
  var emailAlias = "alias@example.com";  
  var recipient = userInfo[2];  
  var subject = "Teste Remetente";
  var body = "Teste de email ";

 
  var emailOptions = {
    name: "Vinicius Test",  
    from: emailAlias,
  };

  // Envia o email usando o alias
  MailApp.sendEmail(recipient, subject, body, emailOptions);
}



function userClicked(userInfo){
    var ss = SpreadsheetApp.openByUrl(urlSubmit);
    var ws = ss.getSheetByName("userInfos");
    
    let destinatario = userInfo[2]; 
    let assunto = "Confirmação de Exclusão de Disciplina";
    let corpo = `
  Prezado(a) ${userInfo[0]},

  Espero que esta mensagem o(a) encontre bem.

  Recebemos a sua solicitação de exclusão da disciplina ${userInfo[3]} e gostaríamos de confirmar que o pedido foi processado com sucesso. A partir de 28/06/2024, você não estará mais matriculado(a) nesta disciplina.

  Se precisar de assistência adicional ou tiver dúvidas sobre como esta exclusão pode impactar sua grade curricular, por favor, entre em contato com a secretaria acadêmica ou com o seu orientador acadêmico. Estamos à disposição para ajudar no que for necessário.

  Agradecemos a sua compreensão e desejamos sucesso em suas demais disciplinas.

  Atenciosamente,

  [Seu Nome]
  [Seu Cargo]
  [Nome da Instituição]
  [Telefone]
  [E-mail]`; 

    //MailApp.sendEmail(destinatario, assunto, corpo);
    ws.appendRow(userInfo);

}
