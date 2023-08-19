interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    label: string;
    disabled?: boolean;
};

function Button({label, onClick, disabled = false}: Props) {
    return <button disabled={disabled} onClick={onClick}>{label}</button>
}

export default Button;