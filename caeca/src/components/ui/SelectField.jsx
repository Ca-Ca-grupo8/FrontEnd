import '../../styles/SelectField.css';

export function SelectField({
    data,
    label,
    value,
    onChange,
    required = false,
    disabled = false,
    placeholder = "Selecione...",
}) {
    return (
        <div className="select-field-container">
            <label className="select-field-label">
                {label} {required && <span className="required-indicator">*</span>}
            </label>
            <select
                value={value}
                className="select-field-select"
                onChange={onChange}
                required={required}
                disabled={disabled}
            >
                <option value="" disabled>{placeholder}</option>
                {data?.map((item) => (
                    <option value={item.id} key={item.id}>{item.nome}</option>
                ))}
            </select>
        </div>
    );
}