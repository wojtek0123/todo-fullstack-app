import { gql } from '@apollo/client';
import { ApolloServer, AuthenticationError } from 'apollo-server-micro';
import { PrismaClient } from '@prisma/client';
import Cors from 'micro-cors';
// import { getSession } from 'next-auth/react';

import { Context } from './context';

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
    email: String!
    tasks: [Task!]
  }

  type Query {
    tasks: [Task]
    users: [User]
  }

  type Mutation {
    addTask(text: String, user: String): Task
    editTask(id: String, text: String): Task
    deleteTask(id: String): Task
  }
`;

const resolvers = {
  Query: {
    tasks: () => {
      return prisma.task.findMany();
    },
    users: () => {
      return prisma.user.findMany();
    },
  },

  Mutation: {
    addTask: async (
      parent: any,
      args: { text: string; user: string },
      context: any
    ) => {
      return context.prisma.task.create({
        data: { task: args.text, ownerId: args.user },
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
