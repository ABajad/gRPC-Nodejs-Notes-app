//read all notes at once
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

client.readNotes({}, (err, response) => {
    console.log(
        chalk.green("Response from server :") +
            chalk.bgCyanBright.black(JSON.stringify(response))
    );
});
