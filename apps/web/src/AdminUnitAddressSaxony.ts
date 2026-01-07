import Papa from 'papaparse';
import csvData from './LDS_Gemeindeverzeichnis_Sachsen.txt';
import type { AdminUnitData } from './types.ts';


export const parseCsvAdminUnitsSaxony = async (): Promise<AdminUnitData[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse<AdminUnitData>(csvData, {
            header: true,
            delimiter: ";",
            complete: (results) => {
                resolve(results.data);
            },
            error: (error: any) => {
                reject(error);
            },
        });
    });
};