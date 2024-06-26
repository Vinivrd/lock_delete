
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
      lista = get_displinas_data(curso_name);
      break;
    case "Bacharelado em Matemática":
      curso_name = "BMA";
      lista = get_displinas_data(curso_name);
      break;
    case "Matemática- Núcleo Geral":
      curso_name = "MATNG";
      lista = get_displinas_data(curso_name);
      break;
    case "Licenciatura em Matemática":
      curso_name = "LMA";
      lista = get_displinas_data(curso_name);
      break;
    case "Bacharelado em Estatística e Ciência de Dados":
      curso_name = "BECD";
      lista = get_displinas_data(curso_name);
      break;
    case "Bacharelado em Sistema de Informação":
      curso_name = "BSI";
      lista = get_displinas_data(curso_name);
      break;
    case "Bacharelado em Ciências de Computação":
      curso_name = "BCC";
      lista = get_displinas_data(curso_name);
      break;
    case "Bacharelado em Matemática Aplicada e Computação Científica":
      curso_name = "BMACC";
      lista = get_displinas_data(curso_name);
      break;
    default:
      break;
  }
  return lista;
}

function get_displinas_data(curso){
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



function userClicked(userInfo,seletor){

    var ss = SpreadsheetApp.openByUrl(urlSubmit);
    var ws = ss.getSheetByName(`userInfo ${seletor}`);
    
    let destinatario = userInfo[2]; 
    let assunto = "Confirmação de Exclusão de Disciplina";
    let dataAtual = new Date();
    let dataFormatada = Utilities.formatDate(dataAtual, Session.getScriptTimeZone(), 'dd/MM/yyyy');
    let cc = "viniciuscmbr@usp.br"
    let replyTo = 'viniciuscmbr@usp.br';

    var options = {
      name: "No Reply",
      replyTo: "no-reply@example.com"
    };
    
    let corpo = `
  Prezado(a) ${userInfo[0]},

Espero que esta mensagem o(a) encontre bem.

Recebemos a sua solicitação para ${seletor} a disciplina ${userInfo[10]} e gostaríamos de confirmar que o pedido foi processado com sucesso. A partir de ${dataFormatada}
Se precisar de assistência adicional ou tiver dúvidas sobre como esta exclusão pode impactar sua grade curricular, por favor, entre em contato com a secretaria acadêmica ou com o seu orientador acadêmico. Estamos à disposição para ajudar no que for necessário.

Agradecemos a sua compreensão e desejamos sucesso em suas demais disciplinas.

Atenciosamente,

Vinicius Diniz
Programador
Universidade de São Paulo
11-969238993
viniciuscmbrr@gmail.com
`;
  

  ws.appendRow(userInfo);
  MailApp.sendEmail(destinatario, assunto,corpo,{noReply:true});

  emailCurso(userInfo[3],userInfo);
}

function emailCurso(curso,userInfo){
    switch (curso) { 
      case "Bacharelado em Ciência de Dados":
        MailApp.sendEmail("viniciuscmbr@usp.br",`recebemos o e-mail do ${userInfo[0]}`,"teste",{replyTo:userInfo[2]});
        break;
      case "Bacharelado em Matemática":
        MailApp.sendEmail("secmat@icmc.usp.br ",`recebemos o e-mail do ${userInfo[0]}`,"teste",{replyTo:userInfo[2]});
        break;
      case "Matemática- Núcleo Geral":
        MailApp.sendEmail("secmat@icmc.usp.br",`recebemos o e-mail do ${userInfo[0]}`,"teste",{replyTo:userInfo[2]});
        break;
      case "Licenciatura em Matemática":
        MailApp.sendEmail("secmat@icmc.usp.br",`recebemos o e-mail do ${userInfo[0]}`,"teste",{replyTo:userInfo[2]});
        break;
      case "Bacharelado em Estatística e Ciência de Dados":
        MailApp.sendEmail("secbecd@icmc.usp.br",`recebemos o e-mail do ${userInfo[0]}`,"teste",{replyTo:userInfo[2]});
        break;
      case "Bacharelado em Sistema de Informação":
        MailApp.sendEmail("secbsi@icmc.usp.br",`recebemos o e-mail do ${userInfo[0]}`,"teste",{replyTo:userInfo[2]});
        break;
      case "Bacharelado em Ciências de Computação":
        MailApp.sendEmail("secbcc@icmc.usp.br ",`recebemos o e-mail do ${userInfo[0]}`,"teste",{replyTo:userInfo[2]});
        break;
      case "Bacharelado em Matemática Aplicada e Computação Científica":
        MailApp.sendEmail("secmat@icmc.usp.br",`recebemos o e-mail do ${userInfo[0]}`,"teste",{replyTo:userInfo[2]});
        break;
    
      default:
        break;
    }
}


