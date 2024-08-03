// import ErrsMsgs from '../data/messages/errors.msg.json';
import ErrsMsgs from '../../src/data/messages/errors.msg.json';
import fs from 'node:fs';
import { nanoid as f_makeUUID } from 'nanoid';
import { URL } from 'node:url';

const fsP = fs.promises;

class RAMBox<T extends Record<string, any> = {}> {
    private i: Item<T>[] = [];

    constructor(
        public readonly fileName: string,
        public readonly fileDir: string
    ) {
        this.filePath = `${fileDir}${fileName}`;
        this.#init();
    }

    public readonly filePath: string;
    //  ai you can't just straight make it async with out controlling the flow of the program
    async #init(): Promise<void> {
        try {
            const data = await fsP.readFile(this.filePath, 'utf-8');
            this.i = JSON.parse(data);
        } catch (err) {
            console.error(new Error(`${ErrsMsgs.CLASS__INIT}:\n ${(err as Error).message}`, { cause: 'CLASS__INIT' }));
        }
    }

    #dataChecks(flags: Partial<DataChecksFlags> = {}, data = this.i): boolean {
        const F: DataChecksFlags = { NO_DATA: true, ...flags };
        if (F.NO_DATA && !data.length) {
            console.error(new Error(ErrsMsgs.NO_DATA, { cause: 'NO_DATA' }));
            return false;
        }
        return true;
    }

    async m_fileGetAll(): Promise<Item<T>[] | Error> {
        try {
            const data = await fsP.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            return new Error(`${ErrsMsgs.CAN_T_READ}:\n ${(err as Error).message}`, { cause: 'CAN_T_READ' });
        }
    }

    m_fileGetAllSync(): Item<T>[] | Error {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            return new Error(`${ErrsMsgs.CAN_T_READ}:\n ${(err as Error).message}`, { cause: 'CAN_T_READ' });
        }
    }

    m_getById(id: string): Item<T> | Error {
        if (!this.#dataChecks()) {
            return new Error(ErrsMsgs.NO_DATA, { cause: 'NO_DATA' });
        }
        const match = this.i.find(obj => id === obj.id);
        return match || new Error(ErrsMsgs.SEARCH__NOT_FOUND, { cause: 'SEARCH__NOT_FOUND' });
    }

    m_new(data: Omit<T, 'id' | 'dateCreated' | 'dateMod'>): Item<T>[] | Error {
        if (!this.#dataChecks({ NO_DATA: false })) {
            return new Error(ErrsMsgs.NO_DATA, { cause: 'NO_DATA' });
        }

        const newItem: Item<T> = {
            id: f_makeUUID(),
            dateCreated: Date.now(),
            ...data
        };

        this.i.push(newItem);
        return this.i;
    }

    m_del(id: string): Item<T>[] | Error {
        if (!this.#dataChecks()) {
            return new Error(ErrsMsgs.NO_DATA, { cause: 'NO_DATA' });
        }

        const index = this.i.findIndex(obj => id === obj.id);
        if (index === -1) {
            return new Error(ErrsMsgs.SEARCH__NOT_FOUND, { cause: 'SEARCH__NOT_FOUND' });
        }

        return this.i.splice(index, 1);
    }

    m_set(id: string, data: Partial<T>): Item<T> | Error {
        if (!this.#dataChecks()) {
            return new Error(ErrsMsgs.NO_DATA, { cause: 'NO_DATA' });
        }

        const index = this.i.findIndex(obj => id === obj.id);
        if (index === -1) {
            return new Error(ErrsMsgs.SEARCH__NOT_FOUND, { cause: 'SEARCH__NOT_FOUND' });
        }

        const target = this.i[index];
        Object.assign(target, data);
        target.dateMod = Date.now();

        return target;
    }

    async m_fileSave(): Promise<boolean | Error> {
        try {
            await fsP.writeFile(this.filePath, JSON.stringify(this.i, null, 4), 'utf-8');
            return true;
        } catch (err) {
            return new Error(`${ErrsMsgs.CAN_T_SAVE}:\n ${(err as Error).message}`, { cause: 'CAN_T_SAVE' });
        }
    }

    async m_fileReset(): Promise<boolean | Error> {
        try {
            await fsP.writeFile(this.filePath, '[]', 'utf-8');
            this.i = [];
            return true;
        } catch (err) {
            return new Error(`${ErrsMsgs.CAN_T_RESET}:\n ${(err as Error).message}`, { cause: 'CAN_T_RESET' });
        }
    }
}

export default RAMBox;
