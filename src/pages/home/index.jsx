import React, { useState, useEffect } from 'react'
import BottomBar from '../../components/BottomBar'
import Header from '../../components/Header'
import ModalAdd from '../../components/Modal/ModalAddTransaction'
import Dashboard from './Dashboard'
import Stats from './Stats'
import './_index.scss'

const Home = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [selectedComponent, setSelectedComponent] = useState('dashboard')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  }

  const handleButtonClick = (component) => {
    setSelectedComponent(component)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
    <ModalAdd isOpen={isModalOpen} onClose={handleCloseModal}/>
    <div className='home'>
      {screenWidth > 1024 ? (
        <>
          <Dashboard />
           <Stats />
        </>
      ) : (
        <>
          <Header title={'Pulpit'}/>
          {selectedComponent === 'dashboard' && <Dashboard />}
          {selectedComponent === 'stats' && <Stats />}
          <BottomBar onButtonClick={handleButtonClick} onOpenModal={() => setIsModalOpen(true)} activeBtn={selectedComponent}/>
        </>
      )}
    </div>
    </>
  )
}

export default Home
