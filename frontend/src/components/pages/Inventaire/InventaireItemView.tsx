import React from "react";

import { useState } from "react";
import HomeBtn from "../../common/HomeBtn";


const InventaireItemView:React.FC= () => {

  return (
    <div  className="container mt-5 " >
          <HomeBtn/>
          <h2 className="fw-bold text-center">إدارة  الجرد</h2>

    </div>

  );
};

export default InventaireItemView;
