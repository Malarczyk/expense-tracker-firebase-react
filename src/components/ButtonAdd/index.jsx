import './_index.scss'

const ButtonAdd = ({action}) => {
  return(
    <div className="buttonAdd" onClick={action}>
      <i className="icon icon--add s32"></i>
    </div>
  )
}

export default ButtonAdd