import * as fs from 'node:fs'
import path from 'node:path'
import { promisify } from 'node:util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile)

export default class Storage {
    private filePath: string;

    constructor(filename: string){
        this.filePath = path.join(__dirname, '/../../storage', filename);
    }

    public async get(): Promise<unknown[]> {
        const data = await readFile(this.filePath);

        try {
            const jsonData = JSON.parse(data.toString());
            return jsonData;
        } catch {
            throw new Error(`Storage file '${this.filePath}' corrupted`);
        }
    }

    public async add(data: any) {
        const jsonData: unknown[] = await this.get();

        try {
            jsonData.push(data);
            await writeFile(this.filePath, JSON.stringify(jsonData));
        } catch (e){
            throw new Error(`Storage file write failed: ${(e as Error).message}`);
        }
    }
}