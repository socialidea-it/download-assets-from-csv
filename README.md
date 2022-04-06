# Downloads assets from CSV
---
Da un CSV file con diverse colonne che contengono url di assets suddivisi per pipeline "|", puoi scaricare tutto in una cartella "downlaods"
tipo:
|ID |post_title |Images                                                     |
|---|-----------|----------------------------------------------------------------|
|1  |Hello World|https://resource.com/image.jpg\|https://resource.com/document.pdf|
|2  |Ciao mondo |https://resource.com/bg.jpg\|https://resource.com/certificate.pdf|

esegui
```shell
node index.js $filePath $columnsName
```

esempio di comando:
```shell
node index.js source/posts.csv "Images"
```
o più colonne separate per virgola
```shell
node index.js source/posts.csv "Images,Documents"
```