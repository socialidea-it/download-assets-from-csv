import csv from "csv-parser";
import * as fs from 'fs';
import path, { resolve } from "path";
import https from "https";
import process from "process";

const __dirname = path.resolve(path.dirname(''));
const DEST_DIR = path.resolve('./downloads');

const getData = async ( filepath, keys )  => {

  const file = path.join(__dirname, filepath )
  
  return new Promise( ( resolve, reject ) => {
    const listFileData = new Promise((resolve, reject) => {
      let listFiles = [];
      fs.createReadStream( file )
        .pipe(csv())
        .on('data', data => {
          keys.map( key => listFiles.push( data[ key ] ) );
        })
        .on('end', () => {
          resolve( listFiles );
        });
    });
  
    listFileData.then( resp => resolve( resp ) );
  })


};

const parseData = ( data ) => {

  let files = [];
  data.map( item => {
    const rows = item.split(',');
    rows.map( row => {
      const line = row.split('|');
      line.map( file => {
        if( file ) files.push( file );
      })
    })

  })

  return files;
}

const downloadFiles = async ( file, total, current ) => {

  const fileUrl = new URL( file );
  const filename = path.basename( fileUrl.pathname );

  https.get( file , (res) => {
    const path = `${DEST_DIR}/${filename}`; 
    const filePath = fs.createWriteStream(path);
    res.pipe(filePath);
    filePath.on('finish',() => {
        filePath.close();
        console.log(` image: ${current} of ${total} : ${filename}`); 
    })
  })

}

( async () => {

  if (!fs.existsSync( DEST_DIR )){
    fs.mkdirSync( DEST_DIR );
  }

  const args = process.argv;
  const file =  args[2];
  const columns = args[3].split(',')
  if( !file ) throw new Error('Indica il percorso al file')
  if( !columns || columns.length < 1 ) throw new Error('Indica le colonne nel formato "Colonna 1,Colonna "')

  const data = await getData( file , columns );
  const files = parseData( data );

  let n = 1;
  files.map( file => {
    downloadFiles( file, files.length, n++ );
  })

})();
