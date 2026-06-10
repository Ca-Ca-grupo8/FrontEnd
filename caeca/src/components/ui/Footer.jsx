import '../../styles/Footer.css'
import logoBranca from '../../assets/logoBranca.png';

export function Footer() {
    return (
        <div className="footer-container">
            <div className="footer-content">
                <img src={logoBranca} alt="Logo Ca&Ca Branca" className="footer-logo" />
                <p>© 2026 Ca&Ca Semijoias - Sistema de Gestão</p>
            </div>
        </div>
    )
}