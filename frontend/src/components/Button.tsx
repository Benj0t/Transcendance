import React from 'react';
interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  label: string;
  disabled?: boolean;
}

const Button: React.FC<Props> = ({ label, onClick, disabled = false }) => {
  return (
    <button disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
