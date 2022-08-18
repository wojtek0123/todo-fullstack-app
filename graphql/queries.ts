import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  {
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
      text
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: String) {
    deleteTask(id: $id) {
      id
      text
    }
  }
`;

export const EDIT_TASK = gql`
  mutation EditTask($id: String, $text: String) {
    editTask(id: $id, text: $text) {
      id
      text
    }
  }
`;
