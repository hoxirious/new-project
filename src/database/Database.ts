import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    private static instance: Database;
    private client: MongoClient;
    private db!: Db;

    private constructor() {
        const uri = process.env.MONGODB_URI as string;
        this.client = new MongoClient(uri);
    }

    public static async getInstance(): Promise<Database> {
        if (!Database.instance) {
            Database.instance = new Database();
            await Database.instance.connect();
        }
        return Database.instance;
    }

    private async connect(): Promise<void> {
        await this.client.connect();
        this.db = this.client.db('crs');
    }

    public getDb(): Db {
        return this.db;
    }

    public async close(): Promise<void> {
        await this.client.close();
    }
}

export { Database };
