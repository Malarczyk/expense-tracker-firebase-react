import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateInput = ({ transactionDate, setTransactionDate }) => {
  const today = new Date();
  const initialDate = transactionDate ? new Date(transactionDate) : today;

  const handleDateChange = date => {
    if (date && !isNaN(date.getTime())) { // Dodatkowe sprawdzenie, czy data jest prawidłowa
      setTransactionDate(date);
    }
  };

  return (
    <div className='datePicker'>
      <label>Data transakcji</label>
      <DatePicker
        selected={initialDate}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="Wybierz datę"
      />
    </div>
  );
};

export default DateInput;
