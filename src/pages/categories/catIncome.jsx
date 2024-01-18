import { useGetCategories } from "../../hooks/useGetCategories"

const CatIncome = ({ onCategoryClick }) => {
  const { categories } = useGetCategories()

  return (
    <div className="categories__type">
      <div className="categories__type__title">
        <h1>Kategorie przychodów</h1>
      </div>
      {categories ? (
        categories.map((category) => {
          const { id, name, categoryType, icon, color, bgColor} = category
          return (
            categoryType === "income" && (
              <div
                key={id}
                className="categories__item"
                onClick={() => onCategoryClick(category)}>
                <div className="categories__item__icon">
                  <div className="iconWrap" style={{ backgroundColor: `var(${bgColor})` }}>
                    <i className={`icon icon--${icon}`} style={{ backgroundColor: `var(${color})` }}></i>
                  </div>
                </div>
                <div className="categories__item__name">
                  <span>{name}</span>
                </div>
                <div className="categories__item__action">
                  <i className="icon icon--arrow-right"></i>
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