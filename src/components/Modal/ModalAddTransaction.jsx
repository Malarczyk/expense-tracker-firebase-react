import { useAddTransactions } from "../../hooks/useAddTransaction";
import { useGetCategories } from "../../hooks/useGetCategories";
import { useGetWallets } from "../../hooks/useGetWallets";
import { useState } from 'react';
import Modal from './index.jsx';
import './_index.scss';
import MyInput from "../forms/MyInput";
import DateInput from "../forms/DateInput";
import MyCashInput from "../forms/MyCashInput";
import MyRadioInput from "../forms/MyRadioInput";

const ModalAddTransaction = ({ isOpen, onClose }) => {
  const { addTransaction } = useAddTransactions();
  const { categories } = useGetCategories();
  const { wallets } = useGetWallets();

  const [name, setName] = useState("");
  const [wallet, setWallet] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("expense");

  const [isCategoryListVisible, setCategoryListVisible] = useState(false);
  const [isWalletListVisible, setWalletListVisible] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    addTransaction({
      name,
      wallet,
      category,
      description,
      transactionAmount,
      transactionType,
      transactionDate: new Date(transactionDate),
    });
  };

  const handleWalletInputClick = () => {
    setWalletListVisible(true);
    setCategoryListVisible(false); // Ukryj listę kategorii
  };

  const handleWalletSelection = (selectedWallet) => {
    setWallet(selectedWallet);
    setWalletListVisible(false);
  };

  const handleCategoryInputClick = () => {
    setCategoryListVisible(true);
    setWalletListVisible(false); // Ukryj listę portfeli
  };

  const handleCategorySelection = (selectedCategory) => {
    setCategory(selectedCategory);
    setCategoryListVisible(false);
  };

  const modalTitle = isCategoryListVisible
    ? "Wybierz kategorię"
    : isWalletListVisible
      ? "Wybierz portfel"
      : "Dodaj Transakcję";

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title={modalTitle}>

      {(isCategoryListVisible || isWalletListVisible) ? null : (
        <div className="modalAddTransaction">
          <form onSubmit={onSubmit}>

            <MyInput
              label="Nazwa"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={'Wpisz nazwę'}
              required
              focus
            />

            <DateInput
              transactionDate={transactionDate}
              setTransactionDate={setTransactionDate}
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


            <MyInput
              label="Wallet"
              placeholder={"Wybierz portfel"}
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              click={handleWalletInputClick}
              required
            />

            <MyInput
              label="Kategoria"
              placeholder={"Wybierz kategorię"}
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              click={handleCategoryInputClick}
              required
            />

            <MyCashInput
              label="Kwota"
              placeholder="Podaj kwotę"
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(e.target.value)}
              required
            />

            <MyInput
              label="Opis"
              type="text"
              value={description}
              placeholder={'Wpisz opis'}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="btnWrap">
              <button className="btn btn--empty">Anuluj</button>
              <button className="btn btn--blue" type="submit">Dodaj</button>
            </div>

          </form>

        </div>)}

      {isCategoryListVisible && (
        <div className="modalAddTransaction--category">
          <div className="back" onClick={() => setCategoryListVisible(false)}>wstecz</div>
          {categories.map((category) => {
            const { id, name, categoryType, icon, color, bgColor } = category
            return (
              categoryType === transactionType && (
                <div key={id} className="categories__item" onClick={() => handleCategorySelection(name)}>
                  <div className="iconWrap" style={{ backgroundColor: `var(${bgColor})` }}>
                    <i className={`icon icon--${icon}`} style={{ backgroundColor: `var(${color})` }}></i>
                  </div>
                  <div className="categories__item__name">
                    <span>{name}</span>
                  </div>
                  <div className="categories__item__action">
                    <i className="icon icon--arrow-right"></i>
                  </div>
                </div>)
            )
          })}
        </div>
      )}

      {isWalletListVisible && (
        <div className="modalAddTransaction--wallets">
          <div className="back" onClick={() => setWalletListVisible(false)}>wstecz</div>
          {wallets.map((wallet) => {
            const { id, name, walletAmount } = wallet
            return (
              <div
                key={id}
                className="wallets__item"
                onClick={() => handleWalletSelection(name)}>
                <div className="wallets__item__body">
                  <h3>{name}</h3>
                  <span>{walletAmount}</span>
                </div>
                <div className="wallets__item__action">
                  <span>arr</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Modal>
  );
};

export default ModalAddTransaction;
