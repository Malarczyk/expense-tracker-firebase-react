import './_index.scss'

const DeletePopup = ({ isOpen, onDeleteConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="deletePopup">
      <div className="deletePopup__content">
        <div className="deletePopup__content__text">
          <h2>Czy napewno chcesz usunąć?</h2>
        </div>
        <div className="deletePopup__buttons">
          <div className="btnWrap">
            <button className='btn btn--red' onClick={onDeleteConfirm}>Tak, usuń</button>
            <button className='btn btn--blue'onClick={onClose}>Nie, nie usuwaj</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DeletePopup