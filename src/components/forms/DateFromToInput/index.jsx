import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateFromToInput = ({ label, date, setDate, placeholder }) => {
  return (
    <div className='datePicker'>
      <label>{label}</label>
      <DatePicker
        selected={date ? new Date(date) : undefined}
        onChange={setDate}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
      />
    </div>
  );
};

export default DateFromToInput;
