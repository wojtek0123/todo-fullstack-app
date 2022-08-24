import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TASK, DELETE_TASK, GET_USER_TASKS } from '../graphql/queries';
import Modal from '../components/Modal';
import { getSession, signOut, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import Task from '../components/Task';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permament: false,
      },
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};

const Home: NextPage = () => {
  const { data: session } = useSession();
  const taskInput = useRef<HTMLInputElement | null>(null);
  const [editId, setEditId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const { data, error, loading, refetch } = useQuery(GET_USER_TASKS, {
    variables: {
      email: session?.user?.email,
    },
  });
  const [addTask] = useMutation(ADD_TASK, {
    onCompleted: () => {
      refetch();
    },
  });

  const setEditTaskIdHandler = (id: string) => {
    setEditId(id);
    setShowEditModal(true);
  };

  const hideModalHandler = () => {
    setEditId('');
    setShowEditModal(false);
  };

  const addTaskSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !taskInput.current?.value ||
      taskInput.current?.value.trim().length === 0
    ) {
      return;
    }
    addTask({ variables: { task: taskInput.current.value, id: data.user.id } });
    taskInput.current.value = '';
  };

  if (error) {
    return (
      <p className='abosolute h-screen w-screen inset-0 flex items-center justify-center uppercase text-xl'>
        Something went wrong!
      </p>
    );
  }

  return (
    <div className='max-w-xl mx-auto w-screen min-h-screen'>
      <Head>
        <title>Fullstack ToDo App</title>
        <meta charSet='UTF-8' />
        <meta
          name='description'
          content='Simple to do app. You can log in via Google account and add, edit, delete tasks.'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header className='bg-blue-600 pb-8 pt-4 rounded-bl-[2.5rem]'>
        <div className='flex flex-col items-center justify-between mx-6 mb-10 text-white'>
          <p className='truncate mr-1'>Log as {session?.user?.email}</p>
          <div className='w-full flex justify-end mt-1'>
            <button
              type='button'
              onClick={() => signOut()}
              className='border-2 text-white text-lg px-4 py-1 rounded-lg hover:bg-white hover:text-blue-600 transition'
            >
              Logout
            </button>
          </div>
        </div>
        <h1 className='text-center text-3xl mb-8 text-white'>
          Fullstack ToDo App
        </h1>
        <form className='flex flex-col items-center' onSubmit={addTaskSubmit}>
          <input
            type='text'
            className='border rounded-lg px-6 py-2 text-lg'
            placeholder='Add task...'
            ref={taskInput}
          />
          <button
            type='submit'
            className='border-2 border-white mt-4 px-6 py-1 text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors'
          >
            Add task
          </button>
        </form>
      </header>
      <main className='mt-6 mx-2 md:mx-0'>
        {loading && <h2 className='text-center text-3xl'>Loading...</h2>}
        {!loading && (
          <ul className='flex flex-col items-start'>
            {data.user.tasks.map((task: { id: string; task: string }) => (
              <Task
                key={task.id}
                task={task}
                refetch={refetch}
                setEditTaskIdHandler={setEditTaskIdHandler}
              />
            ))}
          </ul>
        )}
        {showEditModal && <Modal onHide={hideModalHandler} id={editId} />}
      </main>
    </div>
  );
};

export default Home;
