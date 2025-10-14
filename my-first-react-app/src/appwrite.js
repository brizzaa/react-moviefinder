import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    if (!DATABASE_ID || !COLLECTION_ID || !PROJECT_ID) {
      console.warn(
        "Appwrite configuration incomplete. Search count will not be updated."
      );
      return;
    }

    const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Appwrite error:", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    if (!DATABASE_ID || !COLLECTION_ID || !PROJECT_ID) {
      console.warn(
        "Appwrite configuration incomplete. Trending movies will not be loaded."
      );
      return [];
    }

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents || [];
  } catch (error) {
    console.error("Appwrite error:", error);
    return [];
  }
};
