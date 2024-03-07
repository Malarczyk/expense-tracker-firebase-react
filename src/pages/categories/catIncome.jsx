import UniversalSkeleton from '../../components/skeleton/UniversalSkeleton'
import UniversalEmpty from '../../components/skeleton/UniversalEmpty'
import { useCategories } from "../../hooks/useCategories"

const CatIncome = ({ onCategoryClick, isCategoriesLoading }) => {
  const { categories } = useCategories()
  const incomeCategories = categories?.filter(category => category.categoryType === "income");
  return (
    <div className="categories__type">
      <div className="categories__type__title">
        <h1>Kategorie przychodów</h1>
      </div>
      {isCategoriesLoading
        ? (<UniversalSkeleton amount={3}/>)
        : (
          incomeCategories?.length > 0 ? (
            incomeCategories.map((category) => {
              const { id, name, icon, color, bgColor } = category;
              return (
                <div key={id} className="categories__item" onClick={() => onCategoryClick(category)}>
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
                </div>
              );
            })
          ) : (
            <UniversalEmpty />
          )
        )}

    </div>
  )
}

export default CatIncome