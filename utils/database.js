import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGDB_URI;
export const client = new MongoClient(url);

export const db = client.db("my-blog");
