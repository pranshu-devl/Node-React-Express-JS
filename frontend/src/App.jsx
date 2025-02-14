import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    date: '',
    image: null,
    _id: null, // Add an id field for identifying the post being edited
  });

  // Fetch posts when the component mounts
  useEffect(() => {
    axios.get('http://localhost:8000/api/posts')
      .then(response => setPosts(response.data.data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  // Handle form input changes for creating or editing posts
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  // Handle form submission for creating or updating a post
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('date', newPost.date);
    if (newPost.image) formData.append('image', newPost.image);

    if (newPost._id) {
      // Update post
      axios.put(`http://localhost:8000/api/post/${newPost._id}`, formData)
        .then((response) => {
          // Update the posts state to reflect the updated post
          setPosts(posts.map(post => post._id === newPost._id ? response.data.data : post));
          resetForm();
        })
        .catch((error) => {
          console.error('Error updating post:', error);
        });
    } else {
      // Create new post
      axios.post('http://localhost:8000/api/create-post', formData)
        .then((response) => {
          setPosts([response.data.data, ...posts]);  // Add the new post at the top
          resetForm();
        })
        .catch((error) => {
          console.error('Error creating post:', error);
        });
    }
  };

  // Reset the form after submit (for both create and edit)
  const resetForm = () => {
    setNewPost({ title: '', date: '', image: null, _id: null });
  };

  // Handle delete post
 const handleDelete = (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  
  if (confirmDelete) {
    axios.delete(`http://localhost:8000/api/post/${id}`)
      .then(() => {
        // Remove the deleted post from the posts state
        setPosts(posts.filter(post => post._id !== id));
      })
      .catch((error) => {
        console.error('Error deleting post:', error);
      });
  }
};

  // Handle edit post (load post data into form for editing)
  const handleEdit = (post) => {
    setNewPost({
      title: post.title,
      date: post.date,
      image: post.image,
      _id: post._id,  // Store the post id for updating
    });
  };

  return (
    <div>
      <h1>Posts</h1>
    {/* Form for creating or editing a post */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newPost.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={newPost.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="file"
          name="image"
          onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })}
        />
        
        <button type="submit">{newPost._id ? 'Update Post' : 'Create Post'}</button>
      </form>

      {/* Display posts */}
      <div className="container">
        {posts.map((post) => (
          <div className="post-card" key={post._id}>
            <img
              src={`http://localhost:8000/postImages/${post.image}`}
              alt={post.title}
            />
            <h2>{post.title}</h2>
            <p>{post.date}</p>
            <div>
              <button className="button" onClick={() => handleEdit(post)}>Edit</button>
              <button className="button" onClick={() => handleDelete(post._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;