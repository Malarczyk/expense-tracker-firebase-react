import { useEffect, useRef } from "react";
import './_index.scss'

const Modal = ({ isOpen, title, children, onClose, action }) => {
  const modalRef = useRef(null);

  useEffect(() => {

    if (isOpen && onClose) {
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }

      const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };

      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('mousedown', handleOutsideClick)

      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('mousedown', handleOutsideClick)
      }
    }
  }, [isOpen, onClose])

  const onTouch = (e) => {
    const height = window.innerHeight
    const initialY = e.touches[0].clientY

    const touchMove = (e) => {
      const currentY = e.touches[0].clientY
      if (initialY - currentY > 60 && action) {
        action()
        touchEnd()
      }
      if (currentY - initialY > 60 && onClose) {
        onClose()
        touchEnd()
      }
    }

    const touchEnd = () => {
      document.removeEventListener('touchend', touchEnd, false)
      document.removeEventListener('touchmove', touchMove, false)
    }

    if ((height - initialY < 30 && !isOpen) || isOpen) {
      document.addEventListener('touchend', touchEnd, false)
      document.addEventListener('touchmove', touchMove, false)
    }
  }


  return (
    <>
      <div className={`modal ${isOpen ? 'open' : ''}`} >
        <div className="modal__content"
          ref={modalRef}
          onTouchStart={onTouch}>
          <div className="modal__close" onClick={() => onClose && onClose()}>
            <div className="imgWrap">
              <i className="icon icon--close"></i>
            </div>
          </div>
          <div className="modal__head">
            <h1>{title}</h1>
          </div>
          <div className="modal__body">{children}</div>
        </div>
      </div >

    </>
  )
}

export default Modal