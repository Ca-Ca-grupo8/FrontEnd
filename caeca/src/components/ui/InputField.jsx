import '../../styles/InputField.css';
import { InputData } from './InputData';

export function InputField({ label, type, placeholder, required = false, value, onChange, min, max, step, onFocus, autoComplete, onKeyDown }) {
    return (
        <div className="input-field-container">
            <label className="input-field-label">
                {label} {required && <span className="required-indicator">*</span>}
            </label>
            {type === "date" ? (
                <InputData
                    className="input-field-input"
                    required={required}
                    value={value}
                    onChange={(iso) => onChange?.({ target: { value: iso } })}
                    onFocus={onFocus}
                    onKeyDown={onKeyDown}
                />
            ) : (
            <input
                type={type}
                placeholder={placeholder}
                className="input-field-input"
                required={required}
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={onChange}
                onFocus={onFocus}
                autoComplete={autoComplete}
                onKeyDown={onKeyDown}
            />
            )}
        </div>
    )
}