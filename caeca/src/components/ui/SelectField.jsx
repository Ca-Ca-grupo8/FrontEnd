export function SelectField(
    data,
    error,
    loading
){
    return (
        <div className="input-field-container">
            <label className="input-field-label">
                {label} {required && <span className="required-indicator">*</span>}
            </label>
            <select name="" id="">
                {data && data.map(d => <option value={d}>{d}</option>)}
            </select>
        </div>
    )
}