import React, { useState, useEffect } from 'react'
import TopBar from '../../components/TopBar'
import ModalAddCategory from './modals/modalAddCategory'
import ModalEditCategory from './modals/modalEditCategory'
import CatExpenses from './catExpenses'
import CatIncome from './catIncome'
import { useAddCategories } from '../../hooks/useAddCategories';
import './_index.scss'
import ButtonAdd from '../../components/ButtonAdd'

const Categories = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [selectedComponent, setSelectedComponent] = useState('expenses')
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const { updateCategory } = useAddCategories(); // Dodane pobieranie updateCategory z hooka

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsModalEditOpen(true);
  };

  const handleUpdateCategory = (updatedCategory) => {
    try {
      updateCategory(updatedCategory.id, updatedCategory);
      setIsModalEditOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      // Dodaj odpowiednie obsługi błędów lub komunikaty do użytkownika
    }
  };

  const handleResize = () => {
    setScreenWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <ModalAddCategory isOpen={isModalAddOpen} onClose={() => setIsModalAddOpen(false)}/>
      <ModalEditCategory isOpen={isModalEditOpen} onClose={() => setIsModalEditOpen(false)} selectedCategory={selectedCategory} onUpdateCategory={handleUpdateCategory}/>
      <div className='categories'>
        {screenWidth > 1024 ? (
          <>
            <CatExpenses />
            <CatIncome onCategoryClick={handleCategoryClick}/>
          </>
        ) : (
          <>
            <TopBar title={'Kategorie'}/>
            <div className='categories__types'>
              <span
                onClick={() => setSelectedComponent('expenses')}
                className={selectedComponent === 'expenses' ? 'active' : undefined}>Wydatki</span>
              <span
                onClick={() => setSelectedComponent('income')}
                className={selectedComponent === 'income' ? 'active' : undefined}>Przychody</span>
            </div>
            {selectedComponent === 'expenses' && <CatExpenses />}
            {selectedComponent === 'income' && <CatIncome onCategoryClick={handleCategoryClick} />}
          </>
        )}

        <ButtonAdd action={()=>setIsModalAddOpen(true)}/>
      </div>
    </>
  )
}

export default Categories
