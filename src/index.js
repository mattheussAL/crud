const fs = require('fs');
const express = require('express');
const { resolve } = require('path'); /* <== função especializada na resolução de paths ==> */

const app = express();
const router = express.Router();

app.use(express.json({ extended: true }));

function readFile(){
  const content = fs.readFileSync( resolve(__dirname, '..', 'data', 'items.json') );
  
  return JSON.parse(content);
};

function writeFile(content) {
  const updateFile = JSON.stringify(content);
  fs.writeFileSync( resolve(__dirname, '..', 'data', 'items.json'), updateFile, 'utf-8' );
};

/* == Show Data == */ 
app.get('/', (req, res) => { const content = readFile(); res.send(content) });

/* <== Create Data and Salve ==> */ 
app.post('/', (req, res) => {
  const currentContent = readFile();
  const { name, email, phone } = req.body;

  /* <== Gerador de iD ==> */
  const id = Math.random().toString(32).substr(2, 9);
 
  currentContent.push({ id, name, email, phone });
  writeFile(currentContent);
  
  res.send({id, name, email, phone});
});

/* <== Updated Data in User Array ==> */ 

app.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  const currentContent = readFile();
  const selectedItem = currentContent.findIndex((item) => item.id === id);

  const { id: cId, name: cName, email: cEmail, phone: cPhone, } = currentContent[selectedItem];

  const newObeject = {
    id: cId,
    name: name ? name : cName,
    email: email ? email : cEmail,
    phone: phone ? phone : cPhone,
  };

  currentContent[selectedItem] = newObeject;
  writeFile(currentContent)

  res.send(newObeject);
});

/* == Delete User == */

app.delete('/:id', (req, res) => {
  const {id} = req.params;
  const currentContent = readFile();

  const selectedItem = currentContent.findIndex((item) => item.id === id);

  currentContent.splice(selectedItem, 1);
  writeFile(currentContent);

  res.send('User Deletado com Sucesso');
});

app.use(router);

app.listen(3333, () => console.log('Server Rodando'));