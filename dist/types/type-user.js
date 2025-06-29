"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EStatus = exports.EState = exports.EOccupation = exports.EGender = void 0;
var EGender;
(function (EGender) {
    EGender[EGender["Male"] = 1] = "Male";
    EGender[EGender["Female"] = 2] = "Female";
})(EGender || (exports.EGender = EGender = {}));
var EOccupation;
(function (EOccupation) {
    EOccupation[EOccupation["Student"] = 1] = "Student";
    EOccupation[EOccupation["Employee"] = 2] = "Employee";
})(EOccupation || (exports.EOccupation = EOccupation = {}));
var EState;
(function (EState) {
    EState[EState["Johor"] = 1] = "Johor";
    EState[EState["Kedah"] = 2] = "Kedah";
    EState[EState["Kelantan"] = 3] = "Kelantan";
    EState[EState["Melaka"] = 4] = "Melaka";
    EState[EState["NegeriSembilan"] = 5] = "NegeriSembilan";
    EState[EState["Pahang"] = 6] = "Pahang";
    EState[EState["PulauPinang"] = 7] = "PulauPinang";
    EState[EState["Perak"] = 8] = "Perak";
    EState[EState["Perlis"] = 9] = "Perlis";
    EState[EState["Selangor"] = 10] = "Selangor";
    EState[EState["Terengganu"] = 11] = "Terengganu";
    EState[EState["Sabah"] = 12] = "Sabah";
    EState[EState["Sarawak"] = 13] = "Sarawak";
    EState[EState["WilayahPersekutuanKualaLumpur"] = 14] = "WilayahPersekutuanKualaLumpur";
    EState[EState["WilayahPersekutuanLabuan"] = 15] = "WilayahPersekutuanLabuan";
    EState[EState["WilayahPersekutuanPutrajaya"] = 16] = "WilayahPersekutuanPutrajaya";
})(EState || (exports.EState = EState = {}));
var EStatus;
(function (EStatus) {
    EStatus[EStatus["Active"] = 1] = "Active";
    EStatus[EStatus["Deactive"] = 2] = "Deactive";
})(EStatus || (exports.EStatus = EStatus = {}));
