import style from '../../styles/Button.module.css';

export function Button({ children, type = "button", colorido = true, disabled = false, ...props}){
    return (
        <button className={style['button-container'] + ' ' + (colorido ? style['colorido'] : style['transparente'])}
         type={type}
         disabled={disabled}
         {...props}>
            {children}
        </button>
    )
}