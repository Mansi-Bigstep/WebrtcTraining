import pic from './assets/pic.jpg'

export interface Users {
    users: UserItem[];
}

export interface UserItem {
    img: string,
    name: string,
    email: string,
    id: string
}


export const users: UserItem[] = [
    {
        img: pic,
        name: "Akansha",
        email: "akansha@gmail.com",
        id: "0000"
    },
    {
        img: pic,
        name: "Vartika",
        email: "vertika@gmail.com",
        id: "1111"
    },
    {
        img: pic,
        name: "Sidharth",
        email: "sidharth@gmail.com",
        id: "2222"
    },
    {
        img: pic,
        name: "Anvisha",
        email: "anvisha@gmail.com",
        id: "3333"
    },
    {
        img: pic,
        name: "Sidharth",
        email: "sidharth@gmail.com",
        id: "4444"
    },
    {
        img: pic,
        name: "Anvisha",
        email: "anvisha@gmail.com",
        id: "5555"
    },
    {
        img: pic,
        name: "Anvisha",
        email: "anvisha@gmail.com",
        id: "6666"
    },
    {
        img: pic,
        name: "Sidharth",
        email: "sidharth@gmail.com",
        id: "7777"
    },

]