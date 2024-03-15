import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateInput = ({ transactionDate, setTransactionDate }) => {
  const today = new Date();

  return (
    <div className='datePicker'>
      <label>Data transakcji</label>
      <DatePicker
        selected={transactionDate ? new Date(transactionDate) : today}
        onChange={setTransactionDate}
        dateFormat="dd/MM/yyyy"
        placeholderText="Wybierz datę"
      />
    </div>
  );
};

export default DateInput;
