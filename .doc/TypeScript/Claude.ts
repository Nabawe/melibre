import fs from 'node:fs';
import { nanoid as f_makeUUID } from 'nanoid';
import type { URL } from 'node:url';
// import ErrsMsgs from '../data/messages/errors.msg.json';
import ErrsMsgs from '../../src/data/messages/errors.msg.json';

const fsP = fs.promises;

interface Item {
    id: string;
    title: string;
    price: number;
    thumbnail: URL;
    dateCreated: number;
    dateMod?: number;
}

interface DataChecksFlags {
    NO_DATA?: boolean;
    [key: string]: boolean | undefined;
}

class RAMBox {
    private i: Item[] = [];
    private filePath: string;

    constructor(public fileName: string, public fileDir: string) {
        this.filePath = `${fileDir}${fileName}`;
        this.#init();
    }

    #init(): false | Error {
        try {
            this.i = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
            return false;
        } catch (err) {
            return console.error(new Error(`${ErrsMsgs.CLASS__INIT}:\n ${(err as Error).message}`, { cause: 'CLASS__INIT' }));
        }
    }

    #dataChecks(flags?: DataChecksFlags, data: Item[] = this.i): false | Error {
        const F: DataChecksFlags = { NO_DATA: true, ...flags };
        if (F.NO_DATA && !data.length) {
            return console.error(new Error(`${ErrsMsgs.NO_DATA}`, { cause: 'NO_DATA' }));
        }
        return false;
    }

    async m_fileGetAll(): Promise<Item[] | Error> {
        try {
            const data = JSON.parse(await fsP.readFile(this.filePath, 'utf-8'));
            return data;
        } catch (err) {
            return new Error(`${ErrsMsgs.CAN_T_READ}:\n ${(err as Error).message}`, { cause: 'CAN_T_READ' });
        }
    }

    m_fileGetAllSync(): Item[] | Error {
        try {
            const data = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
            return data;
        } catch (err) {
            return new Error(`${ErrsMsgs.CAN_T_READ}:\n ${(err as Error).message}`, { cause: 'CAN_T_READ' });
        }
    }

    m_getById(id: string): Item | Error {
        const verdict = this.#dataChecks();
        if (verdict instanceof Error) return verdict;

        const match = this.i.find(obj => id === obj.id);
        return match || new Error(ErrsMsgs['SEARCH__NOT_FOUND'], { cause: 'SEARCH__NOT_FOUND' });
    }

    m_new({ title, price, thumbnail }: Omit<Item, 'id' | 'dateCreated'>): Item[] | Error {
        const verdict = this.#dataChecks({ NO_DATA: false });
        if (verdict instanceof Error) return verdict;

        this.i.push({
            id: f_makeUUID(),
            dateCreated: Date.now(),
            title,
            price,
            thumbnail
        });
        return this.i;
    }

    m_del(id: string): Item[] | Error {
        const verdict = this.#dataChecks();
        if (verdict instanceof Error) return verdict;

        const index = this.i.findIndex(obj => id === obj.id);
        if (index === -1) {
            return new Error(ErrsMsgs['SEARCH__NOT_FOUND'], { cause: 'SEARCH__NOT_FOUND' });
        }

        return this.i.splice(index, 1);
    }

    m_set(id: string, data: Partial<Omit<Item, 'id' | 'dateCreated'>>): Item | Error {
        const verdict = this.#dataChecks();
        if (verdict instanceof Error) return verdict;

        const index = this.i.findIndex(obj => id === obj.id);
        if (index === -1) {
            return new Error(ErrsMsgs['SEARCH__NOT_FOUND'], { cause: 'SEARCH__NOT_FOUND' });
        }

        const Target = this.i[index];
        Object.assign(Target, data, { dateMod: Date.now() });

        return Target;
    }

    m_fileSave(): false | Error {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.i, null, 4), 'utf-8');
            return false;
        } catch (err) {
            return new Error(`${ErrsMsgs.CAN_T_SAVE}:\n ${(err as Error).message}`, { cause: 'CAN_T_SAVE' });
        }
    }

    m_fileReset(): false | Error {
        try {
            fs.writeFileSync(this.filePath, '[]', 'utf-8');
            this.i = [];
            return false;
        } catch (err) {
            return new Error(`${ErrsMsgs.CAN_T_RESET}:\n ${(err as Error).message}`, { cause: 'CAN_T_RESET' });
        }
    }
}

export default RAMBox;
