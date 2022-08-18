import { gql } from '@apollo/client';
import { ApolloServer } from 'apollo-server-micro';
import { PrismaClient } from '@prisma/client';
import Cors from 'micro-cors';

const cors = Cors();
const prisma = new PrismaClient();

const typeDefs = gql`
  type Task {
    id: String
    task: String
  }

  type Query {
    tasks: [Task]
  }

  type Mutation {
    addTask(text: String): Task
    editTask(id: String, text: String): Task
    deleteTask(id: String): Task
  }
`;

const resolvers = {
  Query: {
    tasks: () => {
      return prisma.task.findMany();
    },
  },

  Mutation: {
    addTask: (_: any, args: { text: string }) => {
      return prisma.task.create({ data: { task: args.text } });
    },
    editTask: (_: any, args: { id: string; task: string }) => {
      return prisma.task.update({
        where: { id: args.id },
        data: { task: args.task },
      });
    },
    deleteTask: (_: any, args: { id: string }) => {
      return prisma.task.delete({ where: { id: args.id } });
    },
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });
const startServer = apolloServer.start();

export default cors(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
});

export const config = { api: { bodyParser: false } };
