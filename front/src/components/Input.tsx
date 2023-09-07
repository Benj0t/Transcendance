import React from 'react';
interface Props {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  label?: string;
}

const Input: React.FC<Props> = ({ onChange, value, label, name }) => {
  return (
    <div>
      <p>{label}</p>
      <input name={name} value={value} onChange={onChange}></input>
    </div>
  );
};

export default Input;
