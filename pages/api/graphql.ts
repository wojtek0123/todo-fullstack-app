import { gql } from '@apollo/client';
import { ApolloServer } from 'apollo-server-micro';
import { PrismaClient } from '@prisma/client';
import Cors from 'micro-cors';

import { Context } from './context';
import { context } from './context';

const cors = Cors();
const prisma = new PrismaClient();

const typeDefs = gql`
  type Task {
    id: String
    task: String
    user: User
  }

  type User {
    id: String
    email: String
    tasks: [Task]
  }

  type Query {
    user(email: String): User
    users: [User]
    tasks: [Task]
  }

  type Mutation {
    addTask(task: String, id: String): Task
    editTask(id: String, text: String): Task
    deleteTask(id: String): Task
  }
`;

const resolvers = {
  Query: {
    user: (_parent: any, args: { email: string }, context: Context) => {
      return context.prisma.user.findUnique({
        where: {
          email: args.email,
        },
        include: {
          tasks: true,
        },
      });
    },
    users: (_parent: any, _args: any, context: Context) => {
      return context.prisma.user.findMany();
    },
    tasks: (_parent: any, _args: any, context: Context) => {
      return context.prisma.task.findMany();
    },
  },

  Mutation: {
    addTask: async (
      parent: any,
      args: { task: string; id: string },
      context: Context
    ) => {
      return context.prisma.task.create({
        data: {
          task: args.task,
          userId: args.id,
        },
      });
    },
    editTask: (_: any, args: { id: string; text: string }) => {
      return prisma.task.update({
        where: { id: args.id },
        data: { task: args.text },
      });
    },
    deleteTask: (_: any, args: { id: string }) => {
      return prisma.task.delete({ where: { id: args.id } });
    },
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: 'bounded',
  context: context,
});
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
