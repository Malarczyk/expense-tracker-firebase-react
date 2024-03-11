import Image from '../../../assets/images/nodata-bar.svg'

const BarSummary = () => {
  return (
    <>
      <div className="section__title">
        <h1>Podsumowanie finansowe</h1>
        <div>
          <div className="imgWrap">
            <i className="icon icon--arrow-left">{"<"}</i>
          </div>
          <div className="imgWrap">
            <i className="icon icon--arrow-right">{">"}</i>
          </div>
        </div>
      </div>
      <div className="stats__chart --fake">
        <img src={Image} alt="" />
      </div>
    </>
  );
};


export default BarSummary;
