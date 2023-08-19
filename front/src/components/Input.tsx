import { useState } from "react";

interface Props {
    label: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
};

function Input({onChange, value, label}: Props){
   
    console.log('RENDER INPUT')
    return (
        <div>
            <p>{label}</p>
            <input value={value} onChange={onChange}></input>
        </div>
    );
}

export default Input;