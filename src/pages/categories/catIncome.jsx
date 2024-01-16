import { useGetCategories } from "../../hooks/useGetCategories"

const CatIncome = ({onCategoryClick}) => {
  const { categories } = useGetCategories()

  return (
    <div className="categories__type">

      {categories ? (
        categories.map((category) => {
          const { id, name, categoryType, icon } = category
          return (
            categoryType === "income" && (
            <div 
            key={id} 
            className="categories__item"
            onClick={() => onCategoryClick(category)}>
              <div className="categories__item__icon">
                <i className={icon}>IC</i>
              </div>
              <div className="categories__item__name">
                <span>{name}</span>
              </div>
              <div className="categories__item__action">
                <span>arr</span>
              </div>
            </div>)
          )
        })
      ) : (
        <p>Brak kategorii</p>
      )}

    </div>
  )
}

export default CatIncome