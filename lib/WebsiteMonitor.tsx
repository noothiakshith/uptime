"use client";
import React, { useState, useEffect } from "react";

// Define the type for a website
interface Website {
  id: number;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

const WebsiteMonitor: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [name, setName] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  // Fetch all websites on component mount
  useEffect(() => {
    fetchWebsites();
  }, []);

  // Fetch all websites
  const fetchWebsites = async () => {
    try {
      const response = await fetch("/api/websites", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error("Failed to fetch websites");
      }

      const data: Website[] = await response.json();
      setWebsites(data);
    } catch (error) {
      console.error("Error fetching websites:", error);
    }
  };

  // Add a new website
  const addWebsite = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/websites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({ name, url }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error details from the backend
        throw new Error(errorData.message || "Failed to add website");
      }

      const newWebsite: Website = await response.json();
      setWebsites([...websites, newWebsite]); // Update the list of websites
      setName("");
      setUrl("");
    } catch (error) {
      console.error("Error adding website:", error);
    }
  };

  // Delete a website
  const deleteWebsite = async (id: number) => {
    try {
      const response = await fetch("/api/websites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error details from the backend
        throw new Error(errorData.message || "Failed to delete website");
      }

      setWebsites(websites.filter((website) => website.id !== id)); // Update the list of websites
    } catch (error) {
      console.error("Error deleting website:", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Website Monitor</h1>

      {/* Add Website Form */}
      <form onSubmit={addWebsite} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Website Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <input
          type="url"
          placeholder="Website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ marginRight: "10px", padding: "5px" }}
        />
        <button type="submit" style={{ padding: "5px 10px" }}>
          Add Website
        </button>
      </form>

      {/* List of Websites */}
      <div>
        <h2>Monitored Websites</h2>
        <ul style={{ listStyle: "none", padding: "0" }}>
          {websites.map((website) => (
            <li
              key={website.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            >
              <div>
                <strong>{website.name}</strong> - {website.url}
              </div>
              <button
                onClick={() => deleteWebsite(website.id)}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#ff4d4d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebsiteMonitor;