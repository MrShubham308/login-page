import React, { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  const getPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditClick = (post) => {
    setEditId(post._id);
    setEditForm({ title: post.title, content: post.content });
  };

  const handleCancel = () => {
    setEditId(null);
    setEditForm({ title: "", content: "" });
  };

  const handleUpdate = async (id) => {
    try {
      const res = await api.put(`/post/update/${id}`, editForm);
      alert(res.data.message);
      handleCancel();
      getPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Update Failed");
      console.error("Unable to update post", err);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure?");
    if (!confirmDelete) return;
    try {
      const res = await api.delete(`/posts/delete/${id}`);
      alert(res.data.message);
      getPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to delete");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-5">All Posts</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white shadow p-4 rounded-xl border">
            {editId === post._id ? (
              <>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full border p-2 mb-3 rounded"
                />
                <textarea
                  name="content"
                  value={editForm.content}
                  onChange={handleEditChange}
                  className="w-full border p-2 mb-3 rounded"
                />
                <div className="flex gap-3 mb-3">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded"
                    onClick={() => handleUpdate(post._id)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-xl font-extrabold">{post.title}</h1>
                <p className="text-gray-600">{post.content}</p>
                <p className="text-sm mt-2 text-gray-400">By: {post.user?.name || "Unknown"}</p>
              </>
            )}
            
            {/* Show Action controls only when not editing this post */}
            {editId !== post._id && (
              <div className="flex gap-3 mt-3">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={() => handleEditClick(post)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
