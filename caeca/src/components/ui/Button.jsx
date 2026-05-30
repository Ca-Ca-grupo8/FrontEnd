import '../../styles/Button.css';

export function Button({ children, type = "button", colorido = true, ...props}){
    return (
        <button className={`button-container ${colorido ? 'colorido' : 'transparente'}`}
         type={type}
         {...props}>
            {children}
        </button>
    )
}