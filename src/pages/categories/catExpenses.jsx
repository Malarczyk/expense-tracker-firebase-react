import { useCategories } from "../../hooks/useCategories"

const CatExpenses = ({onCategoryClick}) => {
  const { categories } = useCategories()

  return (
    <div className="categories__type">
      <div className="categories__type__title">
        <h1>Kategorie wydatków</h1>
      </div>

      {categories ? (
        categories.map((category) => {
          const { id, name, categoryType, icon, color, bgColor } = category
          return (
            categoryType === "expense" && (
              <div key={id} className="categories__item"
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

export default CatExpenses