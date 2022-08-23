import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_TASK } from '../graphql/queries';

const Modal: React.FC<{
  onHide: () => void;
  id: string;
}> = ({ onHide, id }) => {
  const [enteredText, setEnteredText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [editTask] = useMutation(EDIT_TASK, {
    onCompleted: () => {
      onHide();
    },
  });

  const changeInputHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const task = event.currentTarget.value.trim();
    setErrorMessage('');
    setEnteredText(task);
  };

  const editTaskHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (enteredText.length === 0) {
      setErrorMessage(`Task can't be empty!`);
      return;
    }
    editTask({ variables: { id: id, task: enteredText } });
    setEnteredText('');
  };

  return (
    <>
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center shadow-md shadow-black w-full sm:w-fit bg-blue-600 rounded-2xl z-10 px-10 py-10'>
        <button
          type='button'
          className='absolute right-4 top-4 text-3xl px-2 text-white hover:text-black transition-colors duration-300'
          onClick={onHide}
        >
          X
        </button>
        <h3 className='text-center mb-8 mt-10 text-3xl text-white'>
          Edit your task
        </h3>
        <form onSubmit={editTaskHandler} className='flex flex-col items-center'>
          <input
            type='text'
            className='border rounded-lg px-6 py-2 text-lg mb-2'
            placeholder='Edit task...'
            onChange={changeInputHandler}
          />
          {errorMessage.length !== 0 && (
            <p className='text-center text-red-600 bg-white rounded-xl px-5 py-1 w-fit'>
              {errorMessage}
            </p>
          )}
          <button
            type='submit'
            className='border-2 bg-blue-600 text-white text-lg rounded-lg cursor-pointer hover:bg-white hover:text-blue-600 transition-colors duration-300 mt-6 px-6 py-2'
          >
            Save changes
          </button>
        </form>
      </div>
      <div className='fixed inset-0 bg-black/90'></div>
    </>
  );
};

export default Modal;
