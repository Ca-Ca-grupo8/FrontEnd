import '../../styles/Button.css';

export function Button({ children, type = "button" }){
    return (
        <button className="button-container" type={type}>
            {children}
        </button>
    )
}