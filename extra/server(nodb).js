const grpc = require("grpc"); //main grpc library
const protoLoader = require("@grpc/proto-loader"); //compile protocol buffer file to js file which will have schema and classes
const packageDef = protoLoader.loadSync("../proto/note.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const notePackage = grpcObject.notePackage;
const postgresClient = require("pg").Client;

const client = new postgresClient({
    user: "postgres",
    password: "password",
    host: "172.17.0.2",
    port: 5432,
    database: "notes",
});

client
    .connect()
    .then(() => console.log("connected succesfully"))
    .catch((e) => console.log(e));

const server = new grpc.Server();
server.bind("0.0.0.0:4000", grpc.ServerCredentials.createInsecure());

server.addService(notePackage.Note.service, {
    createNote: createNote,
    readNotes: readNotes,
    readNotesStream: readNotesStream,
    deleteNote: deleteNote,
});
server.start();

const notes = [];
function createNote(call, callback) {
    const note = {
        id: notes.length + 1,
        text: call.request.text,
    };
    notes.push(note);
    console.log(note);
    callback(null, note);
}

function readNotes(call, callback) {
    callback(null, { items: notes });
}

function readNotesStream(call, callback) {
    notes.forEach((note) => call.write(note));
    call.end();
}

function deleteNote(call, callback) {
    console.log(`delete Note with id ${call.request.id}`);
    callback(null, { items: call.request.id });
}
