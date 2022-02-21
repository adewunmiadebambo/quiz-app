import { useNavigate } from "react-router-dom"

const HomePage = () => {
    const navigate = useNavigate()

    return (
       <div className="home">
           <h1>Challenge yourself!</h1>
           <p>Take our expert curated quiz to see how much or how litle you know</p>
           <div className="cta">
               <button onClick={() => navigate('/quiz')}>Get Started</button>
               <button>See Pricing</button>
           </div>
       </div>
    )
}

export default HomePage