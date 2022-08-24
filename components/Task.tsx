import { DELETE_TASK } from '../graphql/queries';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';

const Task: React.FC<{
  task: { id: string; task: string };
  refetch: () => void;
  setEditTaskIdHandler: (id: string) => void;
}> = ({ task, refetch, setEditTaskIdHandler }) => {
  const [deletedTaskId, setDeletedTaskId] = useState('');
  const [deleteTask, { loading: loadingDelete }] = useMutation(DELETE_TASK, {
    onCompleted: () => {
      refetch();
    },
  });

  const deleteTaskHandler = (id: string) => {
    setDeletedTaskId(id);
    deleteTask({ variables: { id } });
  };

  // if (loadingDelete && task.id === deletedTaskId) {
  //   return <li className='py-2 text-lg'>Deleting...</li>;
  // }

  if (task.id === deletedTaskId) {
    return <li></li>;
  }

  return (
    <li
      className='text-lg text-white sm:text-xl px-4 py-2 rounded-xl flex justify-between w-full my-1 items-center bg-blue-600'
      key={task.id}
    >
      {task.task}
      <div>
        <button
          type='button'
          className='border-2 bg-blue-600 py-1 px-2 rounded-xl mr-3 text-white cursor-pointer hover:bg-white hover:text-blue-600 transition-colors'
          onClick={() => setEditTaskIdHandler(task.id)}
        >
          edit
        </button>
        <button
          type='button'
          className='border-2 bg-blue-600 py-1 px-2 rounded-xl text-white cursor-pointer hover:bg-white hover:text-blue-600 transition-colors'
          onClick={() => deleteTaskHandler(task.id)}
        >
          delete
        </button>
      </div>
    </li>
  );
};

export default Task;
