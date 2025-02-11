import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid or missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

const client = new MongoClient(uri, options);
const clientPromise: Promise<MongoClient> = client.connect();

export default clientPromise;

export async function initDatabase() {
  const client = await clientPromise;
  const db = client.db('taskmanager');

  try {
    //Crear la colección 'tasks' con validación de esquema
    await db.createCollection('tasks', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['id', 'title', 'dueDate', 'status'],
          properties: {
            id: {
              bsonType: 'string',
              description: 'must be a string and is required',
            },
            title: {
              bsonType: 'string',
              description: 'must be a string and is required',
            },
            description: {
              bsonType: 'string',
              description: 'must be a string if the field exists',
            },
            dueDate: {
              bsonType: 'string',
              description: 'must be a string (ISO date) and is required',
            },
            status: {
              enum: ['Por hacer', 'En progreso', 'Hecho'],
              description: 'can only be one of the enum values and is required',
            },
          },
        },
      },
    });
    console.log("Collection 'tasks' created with schema validation");
  } catch (error) {
    if ((error as any).codeName === 'NamespaceExists') {
      console.log("Collection 'tasks' already exists. Updating schema...");
      await db.command({
        collMod: 'tasks',
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['id', 'title', 'dueDate', 'status'],
            properties: {
              id: {
                bsonType: 'string',
                description: 'must be a string and is required',
              },
              title: {
                bsonType: 'string',
                description: 'must be a string and is required',
              },
              description: {
                bsonType: 'string',
                description: 'must be a string if the field exists',
              },
              dueDate: {
                bsonType: 'string',
                description: 'must be a string (ISO date) and is required',
              },
              status: {
                enum: ['Por hacer', 'En progreso', 'Hecho'],
                description:
                  'can only be one of the enum values and is required',
              },
            },
          },
        },
      });
      console.log("Schema updated for collection 'tasks'");
    } else {
      console.error('Error creating/updating collection:', error);
    }
  }
}
