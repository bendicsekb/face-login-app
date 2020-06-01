export class FaceAttributes {
    faceRectangle: {
        top: number,
        left: number,
        width: number,
        height: number
    };
    faceAttributes: {
        smile: number,
        gender: string,
        age: number,
        facialHair: {
            moustache: number,
            beard: number,
            sideburns: number
        },
        glasses: string
    };
}
