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

function getDisciplinas(curso) {
  let curso_name = courseCodes[curso];
  let lista;
  if (curso_name) {
    lista = get_displinas_data(curso_name);
  }
  return lista;
}

function get_displinas_data(curso) {
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

function userClicked(userInfo, seletor) {
  let ss = SpreadsheetApp.openByUrl(urlSubmit);
  let ws = ss.getSheetByName(`userInfo ${seletor}`);
  let destinatario = userInfo[2]; 
  let assunto = "Confirmação de Exclusão de Disciplina";
  let dataAtual = new Date();
  let dataFormatada = Utilities.formatDate(dataAtual, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  let corpo = `
    Prezado(a) ${userInfo[0]},

    Recebemos a sua solicitação para ${seletor} a disciplina ${userInfo[11] === '' ? userInfo[14]+"-"+userInfo[15] : userInfo[11]} e informamos que ela será analisada em breve.
    Se precisar de assistência adicional ou tiver dúvidas sobre como esta exclusão pode impactar sua grade curricular, por favor, entre em contato com o Serviço de Graduação ou com o coordenador do curso.

    Atenciosamente,

    Serviço de Graduação do ICMC/USP`;
  ws.appendRow(userInfo);
  MailApp.sendEmail(destinatario, assunto, corpo, {noReply: true});
  emailCurso(userInfo[3], userInfo, seletor);
}

function getEmailbyCourse(curso){
  const emails = {
    "Bacharelado em Ciência de Dados": "viniciuscmbr@usp.br", //secbcdados@icmc.usp.br
    "Bacharelado em Matemática": "secmat@icmc.usp.br",
    "Matemática-Núcleo Geral": "secmat@icmc.usp.br",
    "Licenciatura em Matemática": "secmat@icmc.usp.br",
    "Bacharelado em Estatística e Ciência de Dados": "secbecd@icmc.usp.br",
    "Bacharelado em Sistema de Informação": "secbsi@icmc.usp.br", //secbsi@icmc.usp.br
    "Bacharelado em Ciências de Computação": "secbcc@icmc.usp.br",
    "Bacharelado em Matemática Aplicada e Computação Científica": "secmat@icmc.usp.br"
  };
  return emails[curso];
}
function emailCurso(curso, userInfo, seletor) {
  
  const email = getEmailbyCourse(curso);
  if (email) {
    let corpo = `
      Nome: ${userInfo[0]}
      Curso: ${userInfo[1]}
      Email: ${userInfo[2]}
      Disciplina: ${userInfo[11] === '' ? userInfo[14]+"-"+userInfo[15] : userInfo[11]}
      Créditos-aula matriculado: ${userInfo[8]}
      Créditos-aula final: ${userInfo[20]}
    `;  
    Logger.log(`Sending email to: ${email}`);
    MailApp.sendEmail(email, `Solicitação para ${seletor} a disciplina`, corpo, { replyTo: userInfo[2] });
  } else {
    Logger.log(`Email not found for course: ${curso}`);
  }
}

function takeIntervalDate() {
  let ss = SpreadsheetApp.openByUrl(url);
  let ws = ss.getSheetByName("Data");
  let dataRange = ws.getRange(2, 1, 1, 4);
  let interval = dataRange.getValues()[0];
  return interval;
}
//AQUI EU CARREGO OS ARQUIVOS E MANDO UM EMAIL
function uploadFile(file,file2,userInfo) { //para o trancamento do curso 
  const email = getEmailbyCourse(userInfo[2]);

  //DADOS dos email
  let emailAddress = userInfo[4];
  let subject = 'Trancamento do curso';
  let messagetoUser = `Prezado(a) ${userInfo[0]},\n
  Recebemos sua solicitação de trancamento total do curso. Estamos processando seu pedido e você\n será notificado(a) assim que a solicitação for concluída.`;
  let messageToUs = 
    `Nome: ${userInfo[0]}
      Curso: ${userInfo[2]}
      Email: ${userInfo[4]}
      Já trancou: ${userInfo[7]}
      `

  try {
    let mainFolder  = DriveApp.getFolderById('1KBRAw4hk1rJGD8g6NGQNOwZcbceflYKX');
    let newFolder =  mainFolder.createFolder(`Dados de ${userInfo[0]}`);
  
    let blob = Utilities.newBlob(file.bytes, file.mimeType, file.name);
    let blob2 = Utilities.newBlob(file2.bytes, file2.mimeType, file2.name);

    newFolder.createFile(blob);
    newFolder.createFile(blob2);

    //send e-mail
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: messageToUs,
      attachments: [blob,blob2],
      replyTo: emailAddress
    });
    MailApp.sendEmail({
      to:emailAddress,
      subject: subject,
      body:messagetoUser,
      attachments: [blob,blob2],
    })
    return "Arquivo enivado com sucesso!";
  } catch (e) {
    return "Erro: " + e.toString();
  }
}
function uploadFile1(file,userInfo) { //para matricula 
  const email = getEmailbyCourse(userInfo[2]);
  //DADOS dos email
  let emailAddress = userInfo[4];

  let subject = 'Trancamento do curso';
  let messagetoUser = `Prezado(a) ${userInfo[0]},\n
  Recebemos sua solicitação de trancamento total do curso. Estamos processando seu pedido e você será notificado(a) assim que a solicitação for concluída.`;
  let messageToUs = `
      Nome: ${userInfo[0]}
      Curso: ${userInfo[1]}
      Email: ${userInfo[2]}
      Menos de 12 ou mais de 40: ${userInfo[9]}
      `

  try {
    let mainFolder  = DriveApp.getFolderById('1UMJmnpkGgcxPDbFF0h_ohbd30G1ZG76c');
    let newFolder =  mainFolder.createFolder(`Dados de ${userInfo[0]}`);
    let blob = Utilities.newBlob(file.bytes, file.mimeType, file.name);    

    newFolder.createFile(blob);

    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: messageToUs,
      attachments: [blob],
      replyTo: emailAddress
    });

    //Utilities.sleep(100);

    MailApp.sendEmail({
      to:emailAddress,
      subject: subject,
      body:messagetoUser,
      attachments:[blob],
      noReply: true
    })
  

    return "Arquivo enivado com sucesso!";
  } catch (e) {
    return "Erro: " + e.toString();
  }
}