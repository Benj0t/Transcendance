import React, { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import isUserAuth from '../components/htmlRoutes';
import { useNavigate } from 'react-router';

const Homepage: React.FC = () => {
  /**
   * States
   */
  const [count, setCount] = useState<number>(0);
  const [value, setValue] = useState<string>('');
  const navigate = useNavigate();
  /**
   * Handlers
   */

  if (!isUserAuth()) navigate('/login');
  const augmenterValeur = (): void => {
    setCount((prevState) => prevState + 1);
  };

  const reduireValeur = (): void => {
    setCount((prevState) => prevState - 1);
  };

  const onChangePrenom: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <p>HomePage</p>
      <p>Ma valeur : {count}</p>
      <Button label="Augmenter ma valeur" onClick={augmenterValeur} />
      <Button label="Réduire ma valeur" onClick={reduireValeur} />
      <Input name="prenom" label="Prénom" value={value} onChange={onChangePrenom} />
    </div>
  );
};

export default Homepage;
