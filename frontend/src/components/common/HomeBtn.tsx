
import { FaHome } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

const HomeBtn = () => {
    const navigate = useNavigate();
  return (
       <button onClick={() => navigate("/dashboard")} 
            className="btn btn-outline-dark position-fixed top-0 start-0 m-3 d-flex align-items-center  shadow-lg p-2"
             style={{ width: "45px", height: "45px", display: "flex", justifyContent: "center", alignItems: "center" }}>   
              <FaHome size={20} />      
        </button>
  )
}

export default HomeBtn