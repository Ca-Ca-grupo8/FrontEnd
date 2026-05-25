import '../../styles/Button.css';

export function Button({ children }){
    return (
        <button className="button-container">
            {children}
        </button>
    )
}