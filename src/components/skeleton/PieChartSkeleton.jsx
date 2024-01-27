import "./_index.scss"

const PieChartSkeleton = () => {
  return (
    <>
      <div className="stats__chart --skeleton">
        <div className='stats__chart__title'>
          <h2>Ładowanie danych...</h2>
        </div>
        <div className='stats__chart__content'>
          <div className="circleSkeleton"></div>
        </div>
        <div className='stats__chart__labels'>
          <div className="skeletonLabel"></div>
          <div className="skeletonLabel"></div>
          <div className="skeletonLabel"></div>
          <div className="skeletonLabel"></div>
        </div>
      </div>
    </>
  )
}

export default PieChartSkeleton