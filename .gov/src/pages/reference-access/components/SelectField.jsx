import FormField from './FormField.jsx'
import CustomSelect from './CustomSelect.jsx'

export default function SelectField({ label, required, placeholder, options, value, onChange }) {
  return (
    <FormField label={label} required={required}>
      <CustomSelect
        label={label}
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
      />
    </FormField>
  )
}
