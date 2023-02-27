import { atom } from "recoil";

export const countState = atom({
    key: "countState", // 전역적으로 고유한 값
    default: 0 // 초깃값
});

export const SelectRoomState = atom({
    key : "SelectRoomState",
    default : true
});