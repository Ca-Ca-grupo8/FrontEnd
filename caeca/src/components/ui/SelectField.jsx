import '../../styles/SelectField.css';

export function SelectField({
    data,
    error,
    loading,
    label,
    required = false
}){
    return (
        <div className="select-field-container">
            <label className="select-field-label">
                {label} {required && <span className="required-indicator">*</span>}
            </label>
            <select name="" id="" className='select-field-select'>
                {data && data.map(d => (<option value={d.id} key={d.id}>{d.nome}</option>))}
            </select>
        </div>
    )
}