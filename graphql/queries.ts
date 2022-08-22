import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query Users {
    users {
      id
      email
    }
  }
`;

export const GET_USER_TASKS = gql`
  query User($email: String) {
    user(email: $email) {
      email
      id
      tasks {
        id
        task
      }
    }
  }
`;

export const ADD_TASK = gql`
  mutation AddTask($task: String, $id: String) {
    addTask(task: $task, id: $id) {
      id
      task
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: String) {
    deleteTask(id: $id) {
      id
      task
    }
  }
`;

export const EDIT_TASK = gql`
  mutation EditTask($id: String, $task: String) {
    editTask(id: $id, text: $task) {
      id
      task
    }
  }
`;
