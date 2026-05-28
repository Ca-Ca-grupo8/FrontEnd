import '../../styles/SelectField.css';

export function SelectField({
    data,
    error,
    loading,
    label,
    value,
    onChange,
    required = false
}){
    return (
        <div className="select-field-container">
            <label className="select-field-label">
                {label} {required && <span className="required-indicator">*</span>}
            </label>
            <select value={value} className='select-field-select' onChange={onChange}>
                <option value="" disabled hidden>Selecione...</option>
                {data && data.map(d => (<option value={d.id} key={d.id}>{d.nome}</option>))}
            </select>
        </div>
    )
}