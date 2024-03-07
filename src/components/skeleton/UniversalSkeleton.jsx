import React from 'react';
import "./_index.scss";

const UniversalSkeleton = ({ amount, extraPadding }) => {
  
  const skeletons = Array.from({ length: amount }, (_, index) => (
    <div key={index} className="universal__item --skeleton"></div>
  ));

  return (
    <>
    {extraPadding ? <div className='pad'>{skeletons}</div> : skeletons}
    </>
  );
}

export default UniversalSkeleton;
