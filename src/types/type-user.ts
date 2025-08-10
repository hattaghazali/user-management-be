import { Document } from 'mongoose';

export enum EGender {
    Male = 1,
    Female = 2,
}

export enum EOccupation {
    Student = 1,
    Employee = 2,
}

export enum EState {
    Johor = 1,
    Kedah = 2,
    Kelantan = 3,
    Melaka = 4,
    NegeriSembilan = 5,
    Pahang = 6,
    PulauPinang = 7,
    Perak = 8,
    Perlis = 9,
    Selangor = 10,
    Terengganu = 11,
    Sabah = 12,
    Sarawak = 13,
    WilayahPersekutuanKualaLumpur = 14,
    WilayahPersekutuanLabuan = 15,
    WilayahPersekutuanPutrajaya = 16,
}

export enum EStatus {
    Active = 1,
    Deactive = 2,
}

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    name: string;
    gender: number;
    occupation: number;
    state: number;
    status: EStatus;
    avatar: {
        public_id: string;
        img_url: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
