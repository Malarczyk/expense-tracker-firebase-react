import { useAddCategories } from "../../../hooks/useAddCategories"
import { useState } from 'react'
import Modal from '../../../components/Modal'
import MyInput from "../../../components/forms/MyInput"
import MyInputColor from "../../../components/forms/MyInputColor"
import MyRadioInput from "../../../components/forms/MyRadioInput"

const ModalAddCategory = ({ isOpen, onClose }) => {
  const { addCategory } = useAddCategories()

  const [name, setName] = useState("")
  const [icon, setIcon] = useState("")
  const [color, setColor] = useState("")
  const [bgColor, setBgColor] = useState("")
  const [categoryType, setCategoryType] = useState("expense")
  const [isIconListVisible, setIconListVisible] = useState(false);

  const handleIconInputClick = () => {
    setIconListVisible(true);
  };

  const handleIconSelection = (selectedIcon) => {
    setIcon(selectedIcon);
    setIconListVisible(false);
  };

  const onSubmit = (e) => {
    e.preventDefault()
    addCategory({
      name,
      icon,
      color,
      bgColor,
      categoryType,
    })
  }

  const modalTitle = isIconListVisible
    ? "Wybierz ikonę"
    : "Dodaj Kategorię"

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} title={modalTitle}>

      {!isIconListVisible && <div className="modalAddCategory">

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
          <MyRadioInput
            name="transactionType"
            value1="expense"
            label1="Wydatek"
            checked1={categoryType === 'expense'}
            onChange1={(e) => setCategoryType(e.target.value)}
            value2="income"
            label2="Przychód"
            checked2={categoryType === 'income'}
            onChange2={(e) => setCategoryType(e.target.value)}
          />

          <MyInputColor setColor={setColor} setBgColor={setBgColor} />

          <MyInput
            label="Ikona"
            placeholder={'Wybierz ikonę'}
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            click={handleIconInputClick}
          />
          <div className="btnWrap">
            <button className="btn btn--empty">Anuluj</button>
            <button className="btn btn--blue" type="submit">Dodaj</button>
          </div>
        </form>

      </div>}

      {isIconListVisible && (
        <div className="modalAddCategory--icon">
          <div className="back" onClick={() => setIconListVisible(false)}>wstecz</div>

          <div className="iconWrap" onClick={() => handleIconSelection('arrows')}>
            <i className="icon icon--arrows"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('bitcoin')}>
            <i className="icon icon--bitcoin"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('brain')}>
            <i className="icon icon--brain"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('calc')}>
            <i className="icon icon--arrow-down"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('card')}>
            <i className="icon icon--card"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('chemistry')}>
            <i className="icon icon--chemistry"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('coffee')}>
            <i className="icon icon--coffee"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('dashboard2')}>
            <i className="icon icon--dashboard2"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('energy')}>
            <i className="icon icon--energy"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('fuel')}>
            <i className="icon icon--fuel"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('geek')}>
            <i className="icon icon--geek"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('health')}>
            <i className="icon icon--health"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('kid')}>
            <i className="icon icon--kid"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('love')}>
            <i className="icon icon--love"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('music')}>
            <i className="icon icon--music"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('paint')}>
            <i className="icon icon--paint"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('personal')}>
            <i className="icon icon--personal"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('phone')}>
            <i className="icon icon--phone"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('question')}>
            <i className="icon icon--question"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('screw')}>
            <i className="icon icon--screw"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('shop')}>
            <i className="icon icon--shop"></i>
          </div>

          <div className="iconWrap" onClick={() => handleIconSelection('subscription')}>
            <i className="icon icon--subscription"></i>
          </div>



        </div>)}

    </Modal>
  )
}

export default ModalAddCategory