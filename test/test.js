const grpc = require("grpc"); //main grpc library
const protoLoader = require("@grpc/proto-loader"); //compile protocol buffer file to js file which will have schema and classes
const packageDef = protoLoader.loadSync("../proto/note.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const notePackage = grpcObject.notePackage;
const chalk = require("chalk");

const client = new notePackage.Note(
    "localhost:4000",
    grpc.credentials.createInsecure()
);
//

create_notes();
delete_note();
read_notes();
read_notes_stream();
// drop_table();

//

const testingRPC = new Promise((resolve, reject) => {
    console.log(chalk.bgWhiteBright.red.bold("Testing "));
    if (0) {
        reject("error");
    } else {
        resolve("ok");
    }
});

function create_notes() {
    client.createNote(
        {
            text: "Go for run",
        },
        (err, response) => {
            console.log(
                "(Note creation)Response from server" + JSON.stringify(response)
            );
            return response;
        }
    );
    client.createNote(
        {
            text: "Buy Milk",
        },
        (err, response) => {
            console.log(
                "(Note creation)Response from server" + JSON.stringify(response)
            );
            return response;
        }
    );
}

function delete_note() {
    client.deleteNote(
        {
            id: 1,
        },
        (err, response) => {
            console.log(
                "(Delete Note)Response from server" + JSON.stringify(response)
            );
            return response;
        }
    );
}

function read_notes() {
    client.readNotes({}, (err, response) => {
        console.log(response);

        console.log(
            chalk.green("(Read Note)Response from server :") +
                chalk.bgCyanBright.black(JSON.stringify(response))
        );
    });
}

function read_notes_stream(params) {
    const call = client.readNotesStream();

    call.on("data", (item) => {
        console.log(
            chalk.green("Response from server") +
                chalk.bgBlue(JSON.stringify(item))
        );
    });

    call.on("end", (e) => {
        console.log(chalk.bgRedBright("server done!"));
    });
}

function drop_table() {
    client.droptable({}, (err, response) => {
        console.log(
            "(Delete Note)Response from server" + JSON.stringify(response)
        );
    });
}
