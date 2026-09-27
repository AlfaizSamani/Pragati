import FormField from './FormField.jsx'
import SelectField from './SelectField.jsx'
import CustomSelect from './CustomSelect.jsx'

const CODES = ['+91', '+1', '+44', '+61', '+81', '+971']

const MINISTRIES = [
  'Ministry of Statistics & Programme Implementation',
  'Ministry of Road Transport & Highways',
  'Ministry of Railways',
  'Ministry of Housing & Urban Affairs',
  'Ministry of Power',
  'Ministry of Jal Shakti',
  'NITI Aayog'
]
const DESIGNATIONS = [
  'Secretary', 'Additional Secretary', 'Joint Secretary', 'Director',
  'Deputy Secretary', 'Under Secretary', 'Project Officer', 'Analyst'
]
const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi (NCT)', 'Gujarat', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
]

export default function BasicInformation({ values, set }) {
  return (
    <section className="sec sec--first">
      <h3>1. Basic Information</h3>
      <p className="sec__hint">Provide your official details to get started.</p>

      <div className="grid2">
        <FormField label="Full Name" required>
          <input
            type="text"
            placeholder="Enter your full name"
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Official Email ID" required>
          <input
            type="email"
            placeholder="name@nic.in"
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Phone Number" required>
          <div className="phone">
            <CustomSelect
              label="Country code"
              placeholder="+91"
              options={CODES}
              value={values.code}
              onChange={(v) => set('code', v)}
              compact
            />
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter your mobile number"
              value={values.phone}
              onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>
        </FormField>

        <SelectField
          label="Designation" required
          placeholder="Select designation"
          options={DESIGNATIONS}
          value={values.designation}
          onChange={(v) => set('designation', v)}
        />

        <SelectField
          label="Organization / Ministry" required
          placeholder="Select ministry / department"
          options={MINISTRIES}
          value={values.ministry}
          onChange={(v) => set('ministry', v)}
        />

        <SelectField
          label="State / UT (if applicable)"
          placeholder="Select state / UT"
          options={STATES}
          value={values.state}
          onChange={(v) => set('state', v)}
        />
      </div>
    </section>
  )
}
