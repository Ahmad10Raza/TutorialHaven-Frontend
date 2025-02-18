import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Api";
import Markdown from "react-markdown";
import "../../style/tutorialedit.css";
import Gallery from "../Layout/Gallery";
import FloatingMessage from "../Layout/FloatingMessage";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";

const EditTutorial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [sections, setSections] = useState([{ title: "", content: "" }]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        const response = await API.get(`/tutorial/${id}`);
        const { title, subcategory, sections } = response.data;
        setTitle(title);
        setSubcategory(subcategory);
        setSections(sections);
      } catch (error) {
        console.error("Error fetching tutorial:", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await API.get("/subcategory");
        setSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchTutorial();
    fetchSubcategories();
  }, [id]);

  const handleSectionChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const addSection = () => {
    setSections([...sections, { title: "", content: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/tutorial/update/${id}`, { title, subcategory, sections });
      navigate(`/tutorial/${id}`);
    } catch (error) {
      console.error("Error updating tutorial:", error);
    }
  };

  const handleImageClick = (imageUrl) => {
    navigator.clipboard.writeText(imageUrl).then(() => {
      setMessage("Image URL copied to clipboard!");
      setMessageType("success");
    }).catch(err => {
      console.error("Failed to copy image URL:", err);
    });
  };

  return (
    <div className="tutorial-edit-layout">
      <div className="tutorial-edit-container">
        <h1>Edit Tutorial</h1>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Subcategory:</label>
          <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} required>
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>

          <h3>Sections:</h3>
          {sections.map((section, index) => (
            <div key={index} className="section-group">
              <input
                type="text"
                placeholder="Section Title"
                value={section.title}
                onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                required
              />
              <textarea
                placeholder="Content"
                value={section.content}
                onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                required
              />
              <Markdown
                remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} 
                className="markdown-body"
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {section.content}
              </Markdown>
            </div>
          ))}

          <button type="button" onClick={addSection}>Add Section</button>
          <button type="submit">Update Tutorial</button>
        </form>
      </div>
      <div className="gallery-section">
        <Gallery onImageClick={handleImageClick} />
      </div>
      {message && (
        <FloatingMessage
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />
      )}
    </div>
  );
};

export default EditTutorial;
