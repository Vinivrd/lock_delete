const COURSE_CODES = {
  "Bacharelado em Ciência de Dados": "BCD",
  "Bacharelado em Matemática": "BMA",
  "Matemática-Núcleo Geral": "MATNG",
  "Licenciatura em Matemática": "LMA",
  "Bacharelado em Estatística e Ciência de Dados": "BECD",
  "Bacharelado em Sistema de Informação": "BSI",
  "Bacharelado em Ciências de Computação": "BCC",
  "Bacharelado em Matemática Aplicada e Computação Científica": "BMACC"
};

const EMAILS_BY_COURSE = {
  "Bacharelado em Ciência de Dados": "viniciuscmbr@usp.br",
  "Bacharelado em Matemática": "secmat@icmc.usp.br",
  "Matemática-Núcleo Geral": "secmat@icmc.usp.br",
  "Licenciatura em Matemática": "secmat@icmc.usp.br",
  "Bacharelado em Estatística e Ciência de Dados": "secbecd@icmc.usp.br",
  "Bacharelado em Sistema de Informação": "secbsi@icmc.usp.br",
  "Bacharelado em Ciências de Computação": "secbcc@icmc.usp.br",
  "Bacharelado em Matemática Aplicada e Computação Científica": "secbmacc@icmc.usp.br"
};

function getCourses(){
   let ss = SpreadsheetApp.openByUrl(url);
   let ws = ss.getSheetByName("Cursos");
   let list = ws.getRange(1,1,ws.getRange("A1").getDataRegion().getLastRow(),1).getValues();
   return list.map(value => value[0]);
}

function getEmailbyCourse(curso){
  return EMAILS_BY_COURSE[curso] || null;
}

function get_disciplinas_data(curso) {
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
function getDisciplinas(curso) {
  let courseCode = COURSE_CODES[curso];
  return courseCode ? get_disciplinas_data(courseCode) : [];
}

function userClicked(userInfo, seletor) {
  let ss = SpreadsheetApp.openByUrl(urlSubmit);
  let ws = ss.getSheetByName(`userInfo ${seletor}`);

  //dados email
  let destinatario = userInfo[2]; 
  let assunto = seletor == "trancar" ? "Solicitação de trancamento de disciplina" : "Confirmação de exclusão de Disciplina";

  let corpo = `
    Prezado(a) ${userInfo[0]},\n
    Recebemos a sua solicitação para ${seletor} a disciplina ${userInfo[11] === '' ? userInfo[14]+"-"+userInfo[15] : userInfo[11]} e informamos que ela será analisada em breve.\nSe precisar de assistência adicional ou tiver dúvidas sobre como essa exclusão pode impactar sua grade curricular, por favor, entre em contato com o Serviço de Graduação ou com o coordenador do curso.
    \nAtenciosamente,
    \nServiço de Graduação do ICMC/USP`;
  
  ws.appendRow(userInfo);
  MailApp.sendEmail(destinatario, assunto, corpo, {noReply: true});
  emailCurso(userInfo[3], userInfo, seletor);
}

function emailCurso(curso, userInfo, seletor) {
  const email = getEmailbyCourse(curso);
  
  if (email) {
    let corpo = `
      Nome: ${userInfo[0]}
      Curso: ${userInfo[3]}
      Número USP: ${userInfo[1]}
      Email: ${userInfo[2]}
      Ano de ingresso: ${userInfo[4]}
      Previsão de término: ${userInfo[7]} de ${userInfo[6]}
      Disciplina que requer ${seletor == "trancar" ? "o trancamento" : "a exclusão"}: ${userInfo[11] === '' ? userInfo[14]+"-"+userInfo[15] : userInfo[11]}
      Justificativa: ${userInfo[9]}
      Créditos-aula matriculado: ${userInfo[8]}
      Créditos-aula em que ficará matriculado após ${seletor == "trancar" ? "o trancamento" : " aexclusão"}: ${userInfo[20]}
    `;  
    Logger.log(`Sending email to: ${email}`);
    MailApp.sendEmail(email, `Solicitação para ${seletor} a disciplina`, corpo, { replyTo: userInfo[2] });
  } else {
    Logger.log(`Email not found for course: ${curso}`);
  }
}

//AQUI EU CARREGO OS ARQUIVOS E MANDO UM EMAIL

function uploadFile(file,file2,userInfo) { //para o trancamento do curso 
  return handleFileUpload(file, file2, userInfo, 'Solicitação de trancamento total do curso', '1KBRAw4hk1rJGD8g6NGQNOwZcbceflYKX');
}

function uploadFile1(file,userInfo) { //para matricula 
  return handleFileUpload(file, null, userInfo, 'Solicitação de matrícula em menos de 12 créditos-aula/mais de 40 créditos-aula', '1UMJmnpkGgcxPDbFF0h_ohbd30G1ZG76c');
}

function handleFileUpload(file, file2, userInfo, subject, folderId) {
  const email = getEmailbyCourse(userInfo[2]);
  if (!email) return "Email não encontrado para o curso.";

  let mainFolder = DriveApp.getFolderById(folderId);
  let newFolder = mainFolder.createFolder(`Dados de ${userInfo[0]}`);

  let blobs = [Utilities.newBlob(file.bytes, file.mimeType, file.name)];
  if (file2) blobs.push(Utilities.newBlob(file2.bytes, file2.mimeType, file2.name));

  blobs.forEach(blob => newFolder.createFile(blob));
  

  let messageToUs = `
    Nome: ${userInfo[0]}
    Curso: ${userInfo[2]}
    Número USP: ${userInfo[1]}
    Email: ${userInfo[4]}
    Total de créditos: ${userInfo[6]}
    Já trancou o curso anteriormente: ${userInfo[7]}
    Cumprindo plano de término de curso: ${userInfo[8]}
    Previsão de término: semestre/ano ${userInfo[10]}/${userInfo[9]}
    Justificativa: ${userInfo[17]}
  `;
  let messageToUser = `Prezado(a) ${userInfo[0]},
    Recebemos sua solicitação de trancamento total do curso.
    ${messageToUs}
    Em breve ela será analisada.
    Atenciosamente,
    Serviço de Graduação do ICMC/USP`;

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: messageToUs,
      attachments: blobs,
      replyTo: userInfo[4]
    });

    MailApp.sendEmail({
      to: userInfo[4],
      subject: subject,
      body: messageToUser,
      attachments: blobs
    });

    return "Arquivo enviado com sucesso!";
  } catch (e) {
    return "Erro: " + e.toString();
  }
}

function textEmail(seletor,userInfo){
  let assunto;
  let messageTous;
  let messageToUser;
  let destinatario;

  switch (seletor) {
    case "trancar":
      assunto = "Solicitação de trancamento de disciplina";
      messageTous = `
        Prezado(a) ${userInfo[0]},\n
        Recebemos a sua solicitação para ${seletor} a disciplina ${userInfo[11] === '' ? userInfo[14]+"-"+userInfo[15] : userInfo[11]} e informamos que ela será analisada em breve.\nSe precisar de assistência adicional ou tiver dúvidas sobre como essa exclusão pode impactar sua grade curricular, por favor, entre em contato com o Serviço de Graduação ou com o coordenador do curso.
        \nAtenciosamente,
        \nServiço de Graduação do ICMC/USP`;

        messageToUser = `
          Nome: ${userInfo[0]}
          Curso: ${userInfo[3]}
          Número USP: ${userInfo[1]}
          Email: ${userInfo[2]}
          Ano de ingresso: ${userInfo[4]}
          Previsão de término: ${userInfo[7]} de ${userInfo[6]}
          Disciplina que requer o trancamento: ${userInfo[11] === '' ? userInfo[14]+"-"+userInfo[15] : userInfo[11]}
          Justificativa: ${userInfo[9]}
          Créditos-aula matriculado: ${userInfo[8]}
          Créditos-aula em que ficará matriculado após o trancamento ${userInfo[20]}
        `;  
      break;
    case "excluir":
      assunto = "Solicitação de exclusão de disciplina";
      messageTous = `
        Prezado(a) ${userInfo[0]},\n
        Recebemos a sua solicitação para ${seletor} a disciplina ${userInfo[11] === '' ? userInfo[14]+"-"+userInfo[15] : userInfo[11]} e informamos que ela será analisada em breve.\nSe precisar de assistência adicional ou tiver dúvidas sobre como essa exclusão pode impactar sua grade curricular, por favor, entre em contato com o Serviço de Graduação ou com o coordenador do curso.
        \nAtenciosamente,
        \nServiço de Graduação do ICMC/USP`;

        messageToUser = `
          Nome: ${userInfo[0]}
          Curso: ${userInfo[3]}
          Número USP: ${userInfo[1]}
          Email: ${userInfo[2]}
          Ano de ingresso: ${userInfo[4]}
          Previsão de término: ${userInfo[7]} de ${userInfo[6]}
          Disciplina que requer a exclusão: ${userInfo[11] === '' ? userInfo[14]+"-"+userInfo[15] : userInfo[11]}
          Justificativa: ${userInfo[9]}
          Créditos-aula matriculado: ${userInfo[8]}
          Créditos-aula em que ficará matriculado após a exclusão: ${userInfo[20]}`

      break;
    case "lock_curso":
      
      break;
    case "matricula":
      
      break;
  
    default:
      break;
  }

}


function takeIntervalDate() {
  let ss = SpreadsheetApp.openByUrl(url);
  let ws = ss.getSheetByName("Data");
  let dataRange = ws.getRange(2, 1, 1, 4);
  let interval = dataRange.getValues()[0];
  return interval;
}






