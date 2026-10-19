import { Client, Query, TablesDB, ID } from "appwrite";

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client();

client.setEndpoint(ENDPOINT);
client.setProject(PROJECT_ID);

const db = new TablesDB(client);

// export {client, db};
export const updateSearchCount = async (searchTerm, movie) => {
  // use appwrite sdk to update the search count in the database
  try {
    const result = await db.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });

    // if it does, update the count by 1
    if (result.rows.length > 0) {
      // if the search term already exists, update the count by 1
      const documentId = result.rows[0].$id;
      const currentCount = result.rows[0].count || 0;
      await db.updateRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: documentId,
        data: {
          count: currentCount + 1,
        },
      });
    } else {
      await db.createRow({
        databaseId: DATABASE_ID,
        tableId: COLLECTION_ID,
        rowId: ID.unique(),
        data: {
          searchTerm: searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        },
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await db.listRows({
      databaseId: DATABASE_ID,
      tableId: COLLECTION_ID,
      queries: [Query.limit(10), 
        Query.orderDesc("count")],
    });
    return result.rows;
  } catch (error) {
    console.log(error);
  }
};
