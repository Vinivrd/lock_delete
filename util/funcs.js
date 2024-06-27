
const courseCodes = {
  "Bacharelado em Ciência de Dados": "BCD",
  "Bacharelado em Matemática": "BMA",
  "Matemática-Núcleo Geral": "MATNG",
  "Licenciatura em Matemática": "LMA",
  "Bacharelado em Estatística e Ciência de Dados": "BECD",
  "Bacharelado em Sistema de Informação": "BSI",
  "Bacharelado em Ciências de Computação": "BCC",
  "Bacharelado em Matemática Aplicada e Computação Científica": "BMACC"
};

function getCourses(){
   let ss = SpreadsheetApp.openByUrl(url);
   let ws = ss.getSheetByName("Cursos");
   let list = ws.getRange(1,1,ws.getRange("A1").getDataRegion().getLastRow(),1).getValues();
   return list.map(value => value[0]);
}

function getDisciplinas (curso){
  let curso_name = courseCodes[curso];
  let lista;
  if (curso_name) {
    lista =  get_displinas_data(curso_name);
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

function userClicked(userInfo,seletor){

    var ss = SpreadsheetApp.openByUrl(urlSubmit);
    var ws = ss.getSheetByName(`userInfo ${seletor}`);
    
    let destinatario = userInfo[2]; 
    let assunto = "Confirmação de Exclusão de Disciplina";
    let dataAtual = new Date();
    let dataFormatada = Utilities.formatDate(dataAtual, Session.getScriptTimeZone(), 'dd/MM/yyyy');
    
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

    const emails = {
      "Bacharelado em Ciência de Dados": "viniciuscmbr@usp.br",
      "Bacharelado em Matemática": "secmat@icmc.usp.br",
      "Matemática-Núcleo Geral": "secmat@icmc.usp.br",
      "Licenciatura em Matemática": "secmat@icmc.usp.br",
      "Bacharelado em Estatística e Ciência de Dados": "secbecd@icmc.usp.br",
      "Bacharelado em Sistema de Informação": "secbsi@icmc.usp.br",
      "Bacharelado em Ciências de Computação": "secbcc@icmc.usp.br",
      "Bacharelado em Matemática Aplicada e Computação Científica": "secmat@icmc.usp.br"
    };
    const email = emails[curso];
    if (email) {
      MailApp.sendEmail(email, `recebemos o e-mail do ${userInfo[0]}`, "teste", { replyTo: userInfo[2] });
    }
}


