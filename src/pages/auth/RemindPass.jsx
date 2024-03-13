import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../config/firebase-config'
import './_index.scss'
import { useState, useContext } from 'react'
import { AlertContext } from '../../context/Alert/AlertContext'


const RemindPass = ({ setRemindVisible }) => {
  const [loginInput, setLoginInput] = useState("")
  const [isSend, setIsSend] = useState(false)
  const { showAlert } = useContext(AlertContext)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await sendPasswordResetEmail(auth, loginInput)
      setIsSend(true) // Aktualizuj stan tylko jeśli wysyłka maila się powiedzie
    } catch (error) {
      console.error("Error sending password reset email:", error)
      showAlert(error.message, 'error')
      setIsSend(false)
    }
  }

  return (
    <>
      <div className="login__right__mobile">
        <h1 className='titleLogo'>Zresetuj hasło</h1>
      </div>
    {isSend
      ? (
        <div className='loginForm --success'>
          <div className='loginForm__success'>
            <i className='icon icon--send-mail s64'></i>
            <h2>Mail do resetu hasła został wysłany!</h2>
            <p>Sprawdź swoją pocztę i kliknij w link</p>
          </div>
        </div>)
      : (
        <>
          <div className="remindPass loginForm">

            <div className='loginForm --register'>
              <div className="loginForm__start">
                <h1>Podaj adres e-mail powiązany z kontem, aby zresetować hasło</h1>
              </div>

              <div className="loginForm__content">
                <form onSubmit={handleSubmit}>

                  <div className='myInput'>
                    <label>Login</label>
                    <input
                      type='text'
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      required
                      placeholder='np. biuro@email.com'
                      autoComplete='new-password'
                    />
                  </div>
                  <button className="btn btn--empty" type='submit'>Zresetuj hasło</button>
                </form>
              </div>
              <div className="loginForm__footer">
                <span>Chcesz wrócić do logowania?</span>
                <span className='link' onClick={setRemindVisible}>Kliknij tu</span>
              </div>
            </div>
          </div>
        </>)}
            </>
  )
}
export default RemindPass