import adminUnitsJson from "./gemeindeverzeichnis.json";
import * as z from "zod/v4";

const adminUnitsRuntype = z.array(
  z.object({
    ID: z.string(),
    SCHLNR: z.string(),
    NR_KRS: z.string(),
    GEMEINDE: z.string(),
    STRASSE: z.string(),
    PLZ: z.string(),
    ORT: z.string(),
    PLZ_PSF: z.string(),
    ORT_PSF: z.string(),
    NR_PSF: z.string(),
    OKZ: z.string(),
    TELEFON: z.string(),
    TELEFAX: z.string(),
    E_MAIL: z.string(),
    HOMEPAGE: z.string(),
    AMTSBEZ_BM: z.string(),
    TITEL: z.string(),
    BM_NACHNAME: z.string(),
    BM_VORNAME: z.string(),
    STATUS: z.string(),
    ORTSTEILE: z.string(),
    BEARB_STAND: z.string(),
  }),
);

export const adminUnits = adminUnitsRuntype.parse(adminUnitsJson);
