import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query Tasks {
    tasks {
      id
      task
    }
  }
`;

export const ADD_TASK = gql`
  mutation AddTask($text: String) {
    addTask(text: $text) {
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
