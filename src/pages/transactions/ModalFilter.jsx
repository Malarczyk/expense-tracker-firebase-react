import Modal from "../../components/Modal"
import MyCashInput from "../../components/forms/MyCashInput"
import MyInput from "../../components/forms/MyInput"
import MyRadioInput from "../../components/forms/MyRadioInput"

const ModalFilter = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  wallets, // zakładając, że masz listę portfeli
  categories // oraz listę kategorii
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={'Filtry'}>
      <div className="modalFilter">
        <div className="modalFilter__clear delete" onClick={onClearFilters}>
          <span>Wyczyść filtry</span>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onApplyFilters(); }}>
          <MyCashInput
            name={"minAmount"}
            label={"Kwota od"}
            placeholder={'kwota'}
            value={filters.minAmount}
            onChange={onFilterChange}
          />

          <MyCashInput
            name={"maxAmount"}
            label={"Kwota do"}
            placeholder={'kwota'}
            value={filters.maxAmount}
            onChange={onFilterChange}
          />

          <input type="date" placeholder="Data od" name="fromDate" value={filters.fromDate} onChange={onFilterChange} />
          <input type="date" placeholder="Data do" name="toDate" value={filters.toDate} onChange={onFilterChange} />


          <select name="selectedWallet" value={filters.selectedWallet} onChange={onFilterChange}>
            <option value="">Wybierz portfel</option>
            {wallets.map(wallet => (
              <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
            ))}
          </select>
          <select name="selectedCategories" value={filters.selectedCategories} onChange={onFilterChange} multiple>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <div className="buttons">
            <button type="submit">Filtruj</button>
            <button type="button" onClick={onClose}>Anuluj</button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default ModalFilter;
