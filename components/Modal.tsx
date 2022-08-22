import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_TASK } from '../graphql/queries';

const Modal: React.FC<{
  onHide: () => void;
  id: string;
}> = ({ onHide, id }) => {
  const [editTask] = useMutation(EDIT_TASK, {
    onCompleted: () => {
      onHide();
    },
  });
  const [enteredText, setEnteredText] = useState('');

  const changeInputHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const task = event.currentTarget.value.trim();
    if (task.length === 0) {
      return;
    }
    setEnteredText(task);
  };

  const editTaskHandler = (event: React.FormEvent) => {
    event.preventDefault();
    editTask({ variables: { id: id, task: enteredText } });
    setEnteredText('');
  };

  return (
    <>
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center shadow-md shadow-black w-full sm:w-fit bg-blue-600 rounded-[2rem] z-10'>
        <button
          type='button'
          className='absolute right-4 top-4 text-2xl px-2'
          onClick={onHide}
        >
          X
        </button>
        <h2 className='text-center mb-8 mt-10 text-2xl text-white'>
          Edit your task
        </h2>
        <form onSubmit={editTaskHandler}>
          <input
            type='text'
            className='border rounded-3xl px-6 py-2 text-lg mb-20'
            placeholder='Edit task...'
            onChange={changeInputHandler}
          />
        </form>
      </div>
      <div className='fixed inset-0 bg-black/90'></div>
    </>
  );
};

export default Modal;
