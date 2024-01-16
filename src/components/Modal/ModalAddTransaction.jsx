import { useAddTransactions } from "../../hooks/useAddTransaction";
import { useState } from 'react';
import Modal from './index.jsx';
import './_index.scss';
import MyInput from "../forms/MyInput";
import MyRadioInput from "../forms/MyRadioInput";

const ModalAddTransaction = ({ isOpen, onClose }) => {
  const { addTransaction } = useAddTransactions();

  const [name, setName] = useState("");
  const [wallet, setWallet] = useState("");
  const [category, setCategory] = useState("");
  // const [photoUrl, setPhotoUrl] = useState("");
  const [description, setDescription] = useState("");
  // const [transactionDate, setTransactionDate] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      name,
      wallet,
      category,
      // photoUrl,
      description,
      transactionAmount,
      transactionType,
      // transactionDate,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title="Dodaj Transakcje">

      <div className="modalAddTransaction">

        <form onSubmit={onSubmit}>

          <MyInput
            label="Nazwa"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <MyInput
            label="Opis"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />


          <MyInput
            label="Wallet"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <MyInput
            label="Kategoria"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <MyInput
            label="Kwota"
            type="number"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            required
          />

          <MyRadioInput
            name="transactionType"
            value1="expense"
            label1="Wydatek"
            checked1={transactionType === 'expense'}
            onChange1={(e) => setTransactionType(e.target.value)}
            value2="income"
            label2="Przychód"
            checked2={transactionType === 'income'}
            onChange2={(e) => setTransactionType(e.target.value)}
          />

          <button type="submit">Dodaj</button>
        </form>

      </div>

    </Modal>
  );
};

export default ModalAddTransaction;
