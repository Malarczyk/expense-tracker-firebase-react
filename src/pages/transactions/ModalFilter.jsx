import Modal from "../../components/Modal"
import MyCashInput from "../../components/forms/MyCashInput"
import MyInput from "../../components/forms/MyInput"
import MyRadioInput from "../../components/forms/MyRadioInput"
import DateFromToInput from "../../components/forms/DateFromToInput"
import { useState } from 'react'
import { displayPrice } from "../../utils/strings"

const ModalFilter = ({
  isOpen,
  onClose,
  wallets,
  categories,
  applyFilters
}) => {
  const [isCategoryListVisible, setCategoryListVisible] = useState(false)
  const [isWalletListVisible, setWalletListVisible] = useState(false)
  const [filters, setFilters] = useState({
    minAmount: '',
    maxAmount: '',
    fromDate: '',
    toDate: '',
    transactionType: '',
    selectedWallet: '',
    selectedCategories: [],
  })

  const handleClearFilter = () => {
    const resetFilters = {
      minAmount: '',
      maxAmount: '',
      fromDate: '',
      toDate: '',
      transactionType: '',
      selectedWallet: '',
      selectedCategories: [],
    }
    setFilters(resetFilters)
    applyFilters(resetFilters)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const setDate = (name, date) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: date,
    }))
  }

  const handleCategorySelection = (selectedCategory) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      selectedCategories: [...prevFilters.selectedCategories, selectedCategory],
    }))
    setCategoryListVisible(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    applyFilters(filters)
    onClose()
  }

  const handleWalletInputClick = () => {
    setWalletListVisible(true)
    setCategoryListVisible(false)
  }

  const handleWalletSelection = (selectedWallet) => {
    setFilters({ ...filters, selectedWallet })
    setWalletListVisible(false)
  }

  const handleCategoryInputClick = () => {
    setCategoryListVisible(true)
    setWalletListVisible(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={'Filtry'}>
      {!(isCategoryListVisible || isWalletListVisible) && (
        <div className="modalFilter">

          <div className="modalFilter__clear delete" onClick={handleClearFilter}>
            <span>Wyczyść filtry</span>
          </div>

          <form onSubmit={handleSubmit}>
            <MyCashInput
              name="minAmount"
              label="Kwota od"
              placeholder="kwota"
              value={filters.minAmount}
              onChange={handleChange}
            />

            <MyCashInput
              name="maxAmount"
              label="Kwota do"
              placeholder="kwota"
              value={filters.maxAmount}
              onChange={handleChange}
            />

            <MyRadioInput
              name="transactionType"
              value1="expense"
              label1="Wydatek"             
              onChange1={handleChange}
              value2="income"
              label2="Przychód"
              onChange2={handleChange}
            />


            <DateFromToInput
              label="Data od"
              date={filters.fromDate}
              setDate={(newDate) => setDate('fromDate', newDate)}
              placeholder="Wybierz datę od"
            />

            <DateFromToInput
              label="Data do"
              date={filters.toDate}
              setDate={(newDate) => setDate('toDate', newDate)}
              placeholder="Wybierz datę do"
            />

            <MyInput
              label="Portfel"
              placeholder="Wybierz portfel"
              type="text"
              value={filters.selectedWallet}
              onChange={handleChange}
              click={handleWalletInputClick}
            />

            <MyInput
              label="Kategoria"
              placeholder="Wybierz kategorię"
              type="text"
              value={filters.selectedCategories.join(", ")}
              onChange={handleChange}
              click={handleCategoryInputClick}
            />

            <div className="btnWrap">
              <div className="btn btn--empty" onClick={() => onClose()}>Anuluj</div>
              <button className="btn btn--blue" type="submit">Filtruj</button>
            </div>
          </form>
        </div>
      )}

      {isCategoryListVisible && (
        <div className="modalAddTransaction--category">
          <div className="back" onClick={() => setCategoryListVisible(false)}><i className="icon icon--arrow-left s24"></i></div>
          {categories.map((category) => {
            const { id, name, icon, color, bgColor } = category
            return (
              <div key={id} className="categories__item" onClick={() => handleCategorySelection(name)}>
                <div className="categories__item__icon">
                  <div className="iconWrap" style={{ backgroundColor: `var(${bgColor})` }}>
                    <i className={`icon icon--${icon}`} style={{ backgroundColor: `var(${color})` }}></i>
                  </div>
                </div>
                <div className="categories__item__name">
                  <span>{name}</span>
                </div>
                <div className="categories__item__action">
                  <i className="icon icon--arrow-right"></i>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {isWalletListVisible && (
        <div className="modalAddTransaction--wallets">
          <div className="back" onClick={() => setWalletListVisible(false)}><i className="icon icon--arrow-left s24"></i></div>
          {wallets.map(({ id, name, walletAmount }) => {
            return (
                <div className="universal__item" key={id} onClick={() => handleWalletSelection(name)}>
                  <div className="universal__item__body">
                    <div className="top">
                      <h2>{name}</h2>
                    </div>
                    <div className="bottom">
                      <h4>{displayPrice(walletAmount)}</h4>
                    </div>
                  </div>
                  <div className="universal__item__arr">
                    <i className="icon icon--arrow-right"></i>
                  </div>
                </div>
            )
          })}
        </div>
      )}
    </Modal>
  )
}

export default ModalFilter
