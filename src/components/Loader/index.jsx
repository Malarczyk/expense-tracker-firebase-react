import './_index.scss'

const Loader = () => {
  return (
    <div className='loader'>
      <div className='loading__aninmation'>
        <div className='border out' />
        <div className='border in' />
        <span>Logo</span>
      </div>
    </div>
  )
}

export default Loader