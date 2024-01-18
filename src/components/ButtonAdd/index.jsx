import './_index.scss'

const ButtonAdd = ({action}) => {
  return(
    <div className="buttonAdd" onClick={action}>
      <i className="icon icon--add s24"></i>
    </div>
  )
}

export default ButtonAdd