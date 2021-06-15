const express = require("express");
const app = express();
const graphql = require("graphql");

const grpc = require("grpc"); //main grpc library
const protoLoader = require("@grpc/proto-loader"); //compile protocol buffer file to js file which will have schema and classes
const packageDef = protoLoader.loadSync("../proto/note.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const notePackage = grpcObject.notePackage;
const chalk = require("chalk");
const { graphqlHTTP } = require("express-graphql");

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
} = graphql;

const client = new notePackage.Note(
    "localhost:4000",
    grpc.credentials.createInsecure()
);

const PORT = 6969;

const NoteType = new GraphQLObjectType({
    name: "Notes",
    fields: () => ({
        id: { type: GraphQLInt },
        text: { type: GraphQLString },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getAllNotes: {
            type: new GraphQLList(NoteType),
            args: {},
            async resolve(parent, args) {
                return getAllNotes();
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createNote: {
            type: NoteType,
            args: { text: { type: GraphQLString } },
            async resolve(parent, args) {
                console.log(args.text);
                create_notes(args.text);
                return args;
            },
        },
        deleteNote: {
            type: NoteType,
            args: { id: { type: GraphQLInt } },
            async resolve(parent, args) {
                console.log(args);
                delete_note(args.id);
                return args;
            },
        },
    },
});

function getAllNotes() {
    return new Promise((resolve, reject) => {
        client.readNotes({}, (err, response) => {
            if (err) reject(err);
            resolve(response.items);
        });
    });
}

function create_notes(text) {
    client.createNote(
        {
            text: text,
        },
        (err, response) => {
            console.log(
                "(Note creation)Response from server" + JSON.stringify(response)
            );
            return response;
        }
    );
}
function delete_note(id) {
    client.deleteNote(
        {
            id: id,
        },
        (err, response) => {
            console.log(
                "(Delete Note)Response from server" + JSON.stringify(response)
            );
            return response;
        }
    );
}
const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation });

app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

app.listen(PORT, () => {
    console.log("server Running");
});
