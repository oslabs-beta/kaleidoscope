import { openDb } from '../database/connection';
import { Annotation } from '../types';

export async function initializeDatabase() {
    const db = await openDb();
    await db.run(`
        CREATE TABLE IF NOT EXISTS annotations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nodeId TEXT NOT NULL,
            nodeMapId TEXT NOT NULL,
            annotationName TEXT NOT NULL,
            annotationBody TEXT NOT NULL,
            annotationDate TEXT NOT NULL,
            x INTEGER NOT NULL,
            y INTEGER NOT NULL
        )
    `);
}

// Fetch all annotations
export async function getAllAnnotations() {
    const db = await openDb();
    return await db.all('SELECT * FROM annotations');
}

// Fetch an annotation by ID
export async function getAnnotationById(id: number) {
    const db = await openDb();
    return await db.get('SELECT * FROM annotations WHERE id = ?', [id]);
}

// Insert a new annotation
export async function addAnnotation(annotation: Annotation) {
    const db = await openDb();
    const result = await db.run(
        'INSERT INTO annotations (nodeId, nodeMapId, annotationName, annotationBody, annotationDate, x, y) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [annotation.nodeId, annotation.nodeMapId, annotation.annotationName, annotation.annotationBody, annotation.annotationDate, annotation.x, annotation.y]
    );
    return result.lastID;  // Return the ID of the newly inserted annotation
}

// Update an annotation by ID
export async function updateAnnotation(id: number, annotation: Annotation) {
    const db = await openDb();
    await db.run(
        'UPDATE annotations SET nodeId = ?, nodeMapId = ?, annotationName = ?, annotationBody = ?, annotationDate = ?, x = ?, y = ? WHERE id = ?', 
        [annotation.nodeId, annotation.nodeMapId, annotation.annotationName, annotation.annotationBody, annotation.annotationDate, annotation.x, annotation.y, id]
    );
}

// Delete an annotation by ID
export async function deleteAnnotation(id: number) {
    const db = await openDb();
    await db.run('DELETE FROM annotations WHERE id = ?', [id]);
}
