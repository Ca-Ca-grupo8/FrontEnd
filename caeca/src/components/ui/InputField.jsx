import '../../styles/InputField.css';

export function InputField({ label, type, placeholder, required = false}){
    return (
        <div className="input-field-container">
            <label className="input-field-label">
                {label} {required && <span className="required-indicator">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                className="input-field-input"
                required={required}
            />
        </div>
    )
}