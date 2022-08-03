const express  = require('express')
const {buildSchema } = require('graphql')
const{graphqlHTTP } = require('express-graphql')
const app = express()
const axios = require('axios')

let message = "this is a message"

const schema = buildSchema(`
type User {
    name:String
    age:Int
    college:String
},
type post{
    userId:Int
    id:Int
    title:String
    body:String
}
type Query {
    hello: String!
    welcomeMessage(name: String, dayofweek:String!): String
    getUser:User
    getUsers:[User]
    getPostFromExternalAPI:[post]
    message:String
},
type Mutation{
    setMessage(newMessage: String):String
    createUser(user:UserInput) : User
},

input UserInput{
    name: String
    age:Int
    college:String
}
`);

const root = {
    hello: () => {
       return 'hello world';
      

    },
    welcomeMessage:(args) => {
        console.log(args);
        return `hey ${args.name},hows life, the life is going ${args.dayofweek}`;
    },
    getUser:()=>{
        const User = {
            name:'abc',
            age:20,
            college:'knsit',
        };
        return User;
    },
    getUsers:()=>{
        const User=[
            {
            name:'xyz',
            age:24,
            college:'kns',
        },
        {
            name:'pqr',
            age:22,
            college:'abc',
        }
    ];
    return User;

    },
    setMessage : ({newMessage}) => {
       message = newMessage;
        return message; 
    },
    message:() => message,
    createUser:args=>{
        console.log(args);
     return args.user;
    },
  


    getPostFromExternalAPI: async() => {
        const result = await axios.get(
            'https://jsonplaceholder.typicode.com/posts'
        );
        return result.data
        
    },
    
};

app.use('/graphql',graphqlHTTP({
 graphiql:true,
 schema:schema,   
 rootValue:root,
})
);

app.listen(4000,() => console.log('server on port 4000'));
