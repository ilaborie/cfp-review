export interface Rate {
    id?: number;
    added?: number;
    speakerEmail?: string;

    rate: number; // 1..5
    hate: boolean;
    love: boolean;
}