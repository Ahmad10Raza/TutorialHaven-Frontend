import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../../style/home.css";
import API from '../Api';

const ByCategory = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [tutorials, setTutorials] = useState([]);
  const [filteredTutorials, setFilteredTutorials] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!name) return;

    const fetchData = async () => {
      try {
        const categoryRes = await API.get(`/category/${name}`);
        const categoryId = categoryRes.data._id;
    
        const tutorialRes = await API.get(`/tutorial/category/${categoryId}`);
    
        setCategoryName(categoryRes.data.name);
        setTutorials(tutorialRes.data);
        setFilteredTutorials(tutorialRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    

    fetchData();
    console.log(tutorials)
  }, [name, navigate]);

  // Search function to filter tutorials
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTutorials(tutorials);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = tutorials
        .map(tut => ({
          ...tut,
          matchScore: ((tut.title && tut.title.toLowerCase().includes(lowerQuery)) ? 2 : 0) +
                      ((tut.description && tut.description.toLowerCase().includes(lowerQuery)) ? 1 : 0)
        }))
        .filter(tut => tut.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore);
  
      setFilteredTutorials(filtered);
    }
  }, [searchQuery, tutorials]);
  

  return (
    <div className="tutorial-container">
      <h1>{categoryName}</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search tutorials..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {filteredTutorials.length > 0 ? (
        <ul className="tutorial-items">
          {filteredTutorials.map((tut) => (
            <li className="tutorial-item" key={tut._id} onClick={() => navigate(`/tutorial/${tut.title}`)}>
              <img src={tut.templateImg}/>
              <h3 className="tutorial-title">{tut.title}</h3>
              <p className="tutorial-small-description">{tut.sections[0].title}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tutorials found.</p>
      )}
    </div>
  );
};

export default ByCategory;