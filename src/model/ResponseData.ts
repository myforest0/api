enum Code {
    Success = 200,
    Fail = 100
}

enum Message {
    Success = '成功',
    Fail = '失败'
}

export class ResponseData<T> {
    data: any;
    message: string;
    code: number;

    constructor(data: T) {
        this.data = data
    }

    success() {
        this.code = Code.Success
        this.message = Message.Success
        return this
    }

    fail(msg?: string) {
        this.code = Code.Fail
        this.message = msg || Message.Fail
        return this
    }
}