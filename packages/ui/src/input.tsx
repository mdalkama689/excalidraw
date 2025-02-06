"use client";


interface InputProps {
  type: string;
  placeholder: string;
  className: string,
  onChange: any ,
  value: string 
  name: string
  disabled: boolean
  id: string
}
export const Input = ({ type, placeholder, className, onChange, value, name, id,  disabled }: InputProps) => {

  return(
    <input type={type} name={name} id={id} disabled={disabled}  placeholder={placeholder} className={`${className}`} value={value}  onChange={onChange} />
  )
};
