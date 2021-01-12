import React, { FormEvent, useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Main, Title, Error, Form } from './styles';
import api from '../../services/api';

interface User extends Array<User> {
  first_name: string;

  last_name: string;

  email: string;

  age: number;

  id: number;
}

const Dashboard: React.FC = () => {
  const [inputError, setInputError] = useState('');
  const [newUser, setNewUser] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>(() => {
    const storage = localStorage.getItem('@study-react-django:users');

    if (storage) return JSON.parse(storage);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('@study-react-django:users', JSON.stringify(users));
  }, [users]);

  async function handleAddUser(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      const response = await api.get('users/');

      if (!newUser) {
        setInputError('O usuario nao pode estar em branco.');
        return;
      }

      const foundedUser = response.data.filter((user: User) =>
        user.first_name.includes(newUser),
      );

      if (foundedUser.length <= 0) {
        setInputError('O usuario nao foi encontrado.');
        return;
      }

      setUsers([...users, foundedUser]);
      setIsLoading(false);
      setNewUser('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca de usuarios');
    }
  }

  function handleCheckLoading() {
    if (isLoading === false) {
      return false;
    }
    return true;
  }

  return (
    <>
      <Title>Lista de Usuarios</Title>
      <Form
        hasError={!!inputError}
        onSubmit={(e: FormEvent<HTMLFormElement>) => handleAddUser(e)}
        action=""
      >
        <input
          value={newUser}
          onChange={e => setNewUser(e.target.value)}
          type="text"
          placeholder="Digite aqui o nome do usuario"
        />
        {handleCheckLoading() ? (
          <button type="button">
            <CircularProgress color="primary" />
          </button>
        ) : (
          <button type="submit">Pesquisar usuario</button>
        )}
      </Form>

      {inputError && <Error>{inputError}</Error>}
      <Main>
        {users.map((user: User[]) =>
          user.map(u => (
            <>
              <Link key={u.id} to={`user/${u.id}`}>
                <div>
                  <strong>{u.first_name}</strong>
                  <p>
                    <b>Sobrenome:</b> {u.last_name}
                  </p>
                  <p>
                    <b>Idade: </b> {u.age}
                  </p>
                  <p>
                    <b>Email:</b> {u.email}
                  </p>
                </div>
              </Link>
            </>
          )),
        )}
      </Main>
    </>
  );
};

export default Dashboard;
