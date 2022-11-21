const mysql = require('mysql');
const fs = require('fs');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'idric',
    password: 'Kup33uC4W6',
    database: 'champyresi',
});


//! Champs à modifier.

//* Table à interroger
const table = 'gestion_airs';

//* Attribut de classement
const rangePar = 'id';

//* Nombre de résultat désiré
const limite = 10;

//! -------------------------------------------------

let myData;

const getData = () => {
    return new Promise((resolve, reject) => {

        con.connect(function (err) {
            if (err) throw err;
            console.log('Connecté à la base de données MySQL!');
            //

            //* gestion Air

            con.query(`SELECT * FROM ${table}
               ORDER BY ${rangePar} DESC
               LIMIT ${limite}`
                ,
                function (err, result) {

                    if (err) {

                        reject();

                        throw err;

                    } else {
                        myData = result

                        resolve();

                        console.table(result);

                    }

                }
            );
        });

    });
}

let createFile = () => {
    return new Promise((resolve, reject) => {

        try {

            fs.appendFile('myData.txt', JSON.stringify(myData), function (err) { if (err) throw err; console.log('Fichier créé !'); });

            resolve();

        } catch (error) {
            console.log('err :', error);

            reject();
        }

    });
};

let createFileExcel = () => {
    return new Promise((resolve, reject) => {

        try {

            var aspose = aspose || {};

            aspose.cells = require("aspose.cells");
            // créer un nouveau classeur
            var workbook = new aspose.cells.Workbook(aspose.cells.FileFormatType.XLSX);
            // ajouter de la valeur dans la cellule
            workbook.getWorksheets().get(0).getCells().get("A1").putValue("Hello World!");
            // enregistrer en tant que fichier Excel XLSX
            workbook.save("Excel.xlsx");
            console.log("done...");

            resolve();

        } catch (error) {
            console.log('err :', error);

            reject();
        }

    });
};




//* Resolve promise. 

let handleMyPromise = async () => {

    try {

        await getData();
        //  await createFile();
        await createFileExcel();

    }
    catch (err) {
        console.log('err :', err);
    }
};

handleMyPromise();
